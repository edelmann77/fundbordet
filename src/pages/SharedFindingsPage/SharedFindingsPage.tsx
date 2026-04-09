import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb, ProgressSpinner } from "fundbrdet-ui";
import { useNavigate, useParams } from "react-router-dom";
import type { MapRef } from "react-map-gl/maplibre";
import { type Finding, useUserFindings } from "../../hooks/useFindings";
import { MyFindingsDetail } from "../MyFindingsPage/components/MyFindingsDetail/MyFindingsDetail";
import { MyFindingsSidebar } from "../MyFindingsPage/components/MyFindingsSidebar/MyFindingsSidebar";
import {
  calculateMapBounds,
  getFindingWithCoordinates,
  getFindingsWithCoordinates,
  utmToWGS84,
} from "../MyFindingsPage/myFindingsUtils";
import "../MyFindingsPage/MyFindingsPage.css";

export const SharedFindingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: routeFindingId } = useParams<{ id?: string }>();
  const { findings, loading } = useUserFindings();
  const mapRef = useRef<MapRef>(null);
  const [query, setQuery] = useState("");
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    null,
  );

  const sharedFindings = useMemo(
    () => findings.filter((finding) => finding.accessLevel === "shared"),
    [findings],
  );

  const needle = query.toLowerCase();
  const filteredFindings = needle
    ? sharedFindings.filter((finding) => {
        const ownerName = [finding.ownerFirstName, finding.ownerLastName]
          .map((value) => value?.toLowerCase().trim() ?? "")
          .filter(Boolean)
          .join(" ");

        return (
          finding.genstand?.toLowerCase().startsWith(needle) ||
          finding.datering?.toLowerCase().startsWith(needle) ||
          finding.dime_id?.toLowerCase().startsWith(needle) ||
          ownerName.startsWith(needle) ||
          finding.sharedByEmail?.toLowerCase().startsWith(needle)
        );
      })
    : sharedFindings;

  const selectedFinding = selectedFindingId
    ? (sharedFindings.find((finding) => finding.id === selectedFindingId) ??
      null)
    : null;
  const selectedFindingName =
    selectedFinding?.genstand ||
    selectedFinding?.materiale ||
    t("myFindings.unnamed");

  const findingsWithCoords = useMemo(
    () => getFindingsWithCoordinates(sharedFindings),
    [sharedFindings],
  );

  const selectedWithCoords = useMemo(
    () => getFindingWithCoordinates(selectedFinding),
    [selectedFinding],
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
      ...findingsWithCoords.filter((finding) => finding.id !== selectedWithCoords.id),
    ];
  }, [findingsWithCoords, selectedWithCoords]);

  useEffect(() => {
    if (!routeFindingId) {
      setSelectedFindingId(null);
      return;
    }

    const findingFromRoute = sharedFindings.find(
      (finding) => finding.id === routeFindingId,
    );

    if (!findingFromRoute) {
      return;
    }

    setSelectedFindingId(findingFromRoute.id);
  }, [routeFindingId, sharedFindings]);

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
  }, [selectedFinding]);

  const handleSelectFinding = (findingId: string) => {
    if (selectedFindingId === findingId) {
      navigate("/detector/shared-findings");
      return;
    }

    navigate(`/detector/shared-findings/${findingId}`);
  };

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: "/detector/home" },
        {
          label: t("breadcrumb.sharedFindings"),
          href: "/detector/shared-findings",
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
      <div className="my-findings shared-findings">
        {breadcrumb}
        <div className="my-findings__loading">
          <ProgressSpinner
            size="lg"
            tone="forest"
            label={t("sharedFindings.loading")}
            showLabel
          />
        </div>
      </div>
    );
  }

  if (sharedFindings.length === 0) {
    return (
      <div className="my-findings shared-findings">
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
            {t("sharedFindings.emptyTitle")}
          </p>
          <p className="my-findings__empty-text">{t("sharedFindings.empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-findings shared-findings">
      {breadcrumb}
      <div className="my-findings__container">
        <MyFindingsSidebar
          findings={sharedFindings}
          filteredFindings={filteredFindings}
          query={query}
          selectedFindingId={selectedFindingId}
          countLabelKey="sharedFindings.count"
          onQueryChange={setQuery}
          onSelectFinding={handleSelectFinding}
        />

        <div className="my-findings__detail">
          <MyFindingsDetail
            selectedFinding={selectedFinding}
            editValues={selectedFinding as Partial<Finding> | null}
            isEditing={false}
            saving={false}
            confirmedFriends={[]}
            mapRef={mapRef}
            mapFindings={mapFindings}
            mapBounds={mapBounds}
            shareError={null}
            sharedFriendIds={[]}
            sharesLoading={false}
            sharesSaving={false}
            selectedImages={[]}
            onStartEditing={() => {}}
            onCancel={() => {}}
            onSave={() => {}}
            onShareChange={async () => {}}
            onEditChange={() => {}}
            onImagesChange={() => {}}
            onMapClick={() => {}}
            onMapZoom={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedFindingsPage;