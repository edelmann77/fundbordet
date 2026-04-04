import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "fundbrdet-ui";
import {
  useUserFindings,
  type Finding,
  uploadFindingImages,
  updateCurrentUserFinding,
} from "../../hooks/useFindings";
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
  utmToWGS84,
  wgs84ToUTM,
} from "./myFindingsUtils";
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
  const mapRef = useRef<MapRef>(null);

  const needle = query.toLowerCase();
  const filteredFindings = needle
    ? findings.filter(
        (f) =>
          f.genstand?.toLowerCase().startsWith(needle) ||
          f.datering?.toLowerCase().startsWith(needle) ||
          f.dime_id?.toLowerCase().startsWith(needle),
      )
    : findings;

  const selectedFinding = selectedFindingId
    ? (findings.find((f) => f.id === selectedFindingId) ?? null)
    : null;
  const selectedFindingName =
    selectedFinding?.genstand ||
    selectedFinding?.materiale ||
    t("myFindings.unnamed");

  const handleSelectFinding = (findingId: string) => {
    if (selectedFindingId === findingId) {
      navigate("/detector/my-findings");
    } else {
      navigate(`/detector/my-findings/${findingId}`);
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

  const findingsWithCoords = useMemo(
    () => getFindingsWithCoordinates(findings),
    [findings],
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
    if (!routeFindingId) {
      setSelectedFindingId(null);
      setEditValues(null);
      setSelectedImages([]);
      setIsEditing(false);
      return;
    }

    const findingFromRoute = findings.find((f) => f.id === routeFindingId);
    if (!findingFromRoute) return;

    setSelectedFindingId(findingFromRoute.id);
    setEditValues({ ...findingFromRoute });
    setSelectedImages([]);
    setIsEditing(false);
  }, [routeFindingId, findings]);

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: "/detector/home" },
        {
          label: t("breadcrumb.myFindings"),
          href: "/detector/my-findings",
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
        <div className="my-findings__container">
          <div className="my-findings__list">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="my-findings__card my-findings__card--skeleton"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (findings.length === 0) {
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
          <Link
            to="/detector/create-finding"
            className="my-findings__empty-cta"
          >
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
          findings={findings}
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
            mapRef={mapRef}
            mapFindings={mapFindings}
            mapBounds={mapBounds}
            selectedImages={selectedImages}
            onStartEditing={() => {
              setSelectedImages([]);
              setIsEditing(true);
            }}
            onCancel={handleCancel}
            onSave={handleSave}
            onEditChange={handleEditChange}
            onImagesChange={handleImagesChange}
            onMapClick={handleMapClick}
            onMapZoom={handleMapZoom}
          />
        </div>
      </div>
    </div>
  );
};

export default MyFindingsPage;
