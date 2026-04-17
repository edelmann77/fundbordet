import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, ProgressSpinner } from "fundbrdet-ui";
import {
  listFindingShares,
  useUserFindings,
  type Finding,
  uploadFindingImages,
  updateFindingShares,
  updateCurrentUserFinding,
} from "../../hooks/useFindings";
import {
  listConfirmedFriends,
  type FriendRecord,
} from "../../hooks/useFriendSearch";
import type {
  MapMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { MyFindingsDetail } from "./components/MyFindingsDetail/MyFindingsDetail";
import { MyFindingsSidebar } from "./components/MyFindingsSidebar/MyFindingsSidebar";
import {
  PLACE_MARKER_ZOOM,
  calculateMapBounds,
  getFindingWithCoordinates,
  getFindingsWithCoordinates,
  type FindingWithCoordinates,
  utmToWGS84,
  wgs84ToUTM,
} from "./myFindingsUtils";
import { routes } from "../../lib/routes";
import "./MyFindingsPage.css";

export const MyFindingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: routeFindingId } = useParams<{ id?: string }>();
  const { findings, loading } = useUserFindings();
  const [query, setQuery] = useState("");
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Partial<Finding> | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [zoom, setZoom] = useState(6);
  const [confirmedFriends, setConfirmedFriends] = useState<FriendRecord[]>([]);
  const [sharingLoading, setSharingLoading] = useState(false);
  const [sharingSaving, setSharingSaving] = useState(false);
  const [sharedFriendIds, setSharedFriendIds] = useState<string[]>([]);
  const [shareError, setShareError] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);
  const ownerFindings = useMemo(
    () => findings.filter((finding) => finding.accessLevel === "owner"),
    [findings],
  );

  const needle = query.toLowerCase();
  const filteredFindings = needle
    ? ownerFindings.filter(
        (f) =>
          f.genstand?.toLowerCase().startsWith(needle) ||
          f.datering?.toLowerCase().startsWith(needle) ||
          f.dime_id?.toLowerCase().startsWith(needle),
      )
    : ownerFindings;

  const selectedFinding = selectedFindingId
    ? (ownerFindings.find((f) => f.id === selectedFindingId) ?? null)
    : null;
  const selectedFindingName =
    selectedFinding?.genstand ||
    selectedFinding?.materiale ||
    t("myFindings.unnamed");

  const handleSelectFinding = (findingId: string) => {
    if (selectedFindingId === findingId) {
      navigate(routes.myFindings);
    } else {
      navigate(routes.myFinding(findingId));
    }
  };

  const handleEditChange = (field: keyof Finding, value: any) => {
    setEditValues((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!editValues || !selectedFinding) return;

    setSaving(true);
    try {
      await updateCurrentUserFinding(selectedFinding.id, editValues);
      await uploadFindingImages(selectedFinding.id, selectedImages);

      setSelectedImages([]);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update finding", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImages([]);
    if (selectedFinding) {
      setEditValues({ ...selectedFinding });
    }
  };

  const handleImagesChange = useCallback((images: File[]) => {
    setSelectedImages(images);
  }, []);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!isEditing || zoom < PLACE_MARKER_ZOOM) return;
      const { lng, lat } = e.lngLat;
      const { easting, northing } = wgs84ToUTM(lng, lat);
      setEditValues((prev) =>
        prev ? { ...prev, oest: easting, nord: northing } : prev,
      );
    },
    [isEditing, zoom],
  );

  const handleMapZoom = useCallback((e: ViewStateChangeEvent) => {
    setZoom(e.viewState.zoom);
  }, []);

  const handleMapMarkerSelect = useCallback(
    (finding: FindingWithCoordinates) => {
      navigate(routes.myFinding(finding.id));

      const map = mapRef.current;
      if (map) {
        map.flyTo({
          center: [finding.lng, finding.lat],
          zoom: Math.max(14, map.getZoom()),
          duration: 900,
        });
      }
    },
    [navigate],
  );

  const findingsWithCoords = useMemo(
    () => getFindingsWithCoordinates(ownerFindings),
    [ownerFindings],
  );

  const editedFinding = useMemo(
    () =>
      selectedFinding && editValues
        ? ({ ...selectedFinding, ...editValues } as Finding)
        : selectedFinding,
    [selectedFinding, editValues],
  );

  const selectedWithCoords = useMemo(
    () => getFindingWithCoordinates(editedFinding),
    [editedFinding],
  );

  const mapBounds = useMemo(
    () => calculateMapBounds(findingsWithCoords, selectedWithCoords),
    [findingsWithCoords, selectedWithCoords],
  );

  const mapFindings = useMemo(() => {
    if (!selectedWithCoords) {
      return findingsWithCoords;
    }

    return [
      selectedWithCoords,
      ...findingsWithCoords.filter(
        (finding) => finding.id !== selectedWithCoords.id,
      ),
    ];
  }, [findingsWithCoords, selectedWithCoords]);

  useEffect(() => {
    let isMounted = true;

    const loadConfirmed = async () => {
      try {
        const nextFriends = await listConfirmedFriends();

        if (isMounted) {
          setConfirmedFriends(nextFriends);
        }
      } catch {
        if (isMounted) {
          setConfirmedFriends([]);
        }
      }
    };

    void loadConfirmed();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      selectedFinding &&
      selectedFinding.oest != null &&
      selectedFinding.nord != null
    ) {
      const map = mapRef.current;
      if (map) {
        const [lng, lat] = utmToWGS84(
          Number(selectedFinding.oest),
          Number(selectedFinding.nord),
        );
        map.flyTo({ center: [lng, lat], zoom: 14, duration: 1500 });
      }
    }
  }, [selectedFindingId, selectedFinding]);

  useEffect(() => {
    let isMounted = true;

    if (!selectedFinding || selectedFinding.accessLevel !== "owner") {
      setSharedFriendIds([]);
      setShareError(null);
      setSharingLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadShares = async () => {
      try {
        setSharingLoading(true);
        setShareError(null);

        const nextSharedFriendIds = await listFindingShares(selectedFinding.id);

        if (isMounted) {
          setSharedFriendIds(nextSharedFriendIds);
        }
      } catch {
        if (isMounted) {
          setSharedFriendIds([]);
          setShareError(t("myFindings.shareLoadFailed"));
        }
      } finally {
        if (isMounted) {
          setSharingLoading(false);
        }
      }
    };

    void loadShares();

    return () => {
      isMounted = false;
    };
  }, [selectedFinding, t]);

  useEffect(() => {
    if (!routeFindingId) {
      setSelectedFindingId(null);
      setEditValues(null);
      setSelectedImages([]);
      setIsEditing(false);
      setShareError(null);
      return;
    }

    const findingFromRoute = ownerFindings.find((f) => f.id === routeFindingId);
    if (!findingFromRoute) return;

    setSelectedFindingId(findingFromRoute.id);
    setEditValues({ ...findingFromRoute });
    setSelectedImages([]);
    setIsEditing(false);
  }, [routeFindingId, ownerFindings]);

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: routes.home },
        {
          label: t("breadcrumb.myFindings"),
          href: routes.myFindings,
          current: !selectedFinding,
        },
        ...(selectedFinding
          ? [{ label: selectedFindingName, current: true }]
          : []),
      ]}
    />
  );

  if (loading) {
    return (
      <div className="my-findings">
        {breadcrumb}
        <div className="my-findings__loading">
          <ProgressSpinner
            size="lg"
            tone="forest"
            label={t("myFindings.loading")}
            showLabel
          />
        </div>
      </div>
    );
  }

  if (ownerFindings.length === 0) {
    return (
      <div className="my-findings">
        {breadcrumb}
        <div className="my-findings__empty">
          <svg
            className="my-findings__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
            <path d="M11 8v3" />
            <path d="M11 14h.01" />
          </svg>
          <p className="my-findings__empty-title">
            {t("myFindings.emptyTitle")}
          </p>
          <p className="my-findings__empty-text">{t("myFindings.empty")}</p>
          <Link to={routes.createFinding} className="my-findings__empty-cta">
            {t("myFindings.registerFirst")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-findings">
      {breadcrumb}
      <div className="my-findings__container">
        <MyFindingsSidebar
          findings={ownerFindings}
          filteredFindings={filteredFindings}
          query={query}
          selectedFindingId={selectedFindingId}
          onQueryChange={setQuery}
          onSelectFinding={handleSelectFinding}
        />

        <div className="my-findings__detail">
          <MyFindingsDetail
            selectedFinding={selectedFinding}
            editValues={editValues}
            isEditing={isEditing}
            saving={saving}
            confirmedFriends={confirmedFriends}
            mapRef={mapRef}
            mapFindings={mapFindings}
            mapBounds={mapBounds}
            shareError={shareError}
            sharedFriendIds={sharedFriendIds}
            sharesLoading={sharingLoading}
            sharesSaving={sharingSaving}
            selectedImages={selectedImages}
            onStartEditing={() => {
              setSelectedImages([]);
              setIsEditing(true);
            }}
            onCancel={handleCancel}
            onSave={handleSave}
            onShareChange={async (nextSharedFriendIds) => {
              if (!selectedFinding || selectedFinding.accessLevel !== "owner") {
                return;
              }

              try {
                setSharingSaving(true);
                setShareError(null);
                await updateFindingShares(
                  selectedFinding.id,
                  nextSharedFriendIds,
                );
                setSharedFriendIds(nextSharedFriendIds);
              } catch (error) {
                setShareError(t("myFindings.shareSaveFailed"));
                throw error;
              } finally {
                setSharingSaving(false);
              }
            }}
            onEditChange={handleEditChange}
            onImagesChange={handleImagesChange}
            onMapClick={handleMapClick}
            onMapZoom={handleMapZoom}
            onMapMarkerSelect={handleMapMarkerSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MyFindingsPage;
