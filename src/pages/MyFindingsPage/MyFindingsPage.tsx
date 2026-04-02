import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, TextInput, Button } from "fundbrdet-ui";
import { supabase } from "../../lib/supabase";
import proj4 from "proj4";
import { useUserFindings, type Finding } from "../../hooks/useFindings";
import Map, {
  Marker,
  type MapRef,
  type MapMouseEvent,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MyFindingsPage.css";

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
    roads: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
    labels: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
    {
      id: "roads",
      type: "raster",
      source: "roads",
      paint: {
        "raster-opacity": 0.9,
      },
    },
    {
      id: "labels",
      type: "raster",
      source: "labels",
      paint: {
        "raster-opacity": 1,
      },
    },
  ],
};

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";
const PLACE_MARKER_ZOOM = 14;

function utmToWGS84(easting: number, northing: number): [number, number] {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
}

function wgs84ToUTM(
  lng: number,
  lat: number,
): { easting: number; northing: number } {
  const [easting, northing] = proj4(WGS84, UTM32N, [lng, lat]);
  return { easting: Math.round(easting), northing: Math.round(northing) };
}

function isValidUTM(easting: number, northing: number): boolean {
  return (
    easting >= 400000 &&
    easting <= 900000 &&
    northing >= 6000000 &&
    northing <= 6800000
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFindingsWithCoordinates(
  findings: Finding[],
): Array<Finding & { lng: number; lat: number }> {
  return findings
    .filter((f) => f.oest != null && f.nord != null)
    .filter(
      (f) =>
        isValidUTM(Number(f.oest), Number(f.nord)) &&
        !isNaN(Number(f.oest)) &&
        !isNaN(Number(f.nord)),
    )
    .map((f) => {
      const [lng, lat] = utmToWGS84(Number(f.oest), Number(f.nord));
      return { ...f, lng, lat };
    });
}

function calculateMapBounds(
  findings: Array<Finding & { lng: number; lat: number }>,
  selected?: Finding & { lng: number; lat: number },
): {
  center: [number, number];
  zoom: number;
} {
  // If there's a selected finding, zoom to it
  if (selected) {
    return { center: [selected.lng, selected.lat], zoom: 14 };
  }

  // Otherwise, calculate bounds for all findings
  if (findings.length === 0) return { center: [11.5, 56.2], zoom: 6 };
  if (findings.length === 1) {
    return { center: [findings[0].lng, findings[0].lat], zoom: 14 };
  }

  const lngs = findings.map((f) => f.lng);
  const lats = findings.map((f) => f.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  return { center: [centerLng, centerLat], zoom: 6 };
}

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
    ? findings.find((f) => f.id === selectedFindingId)
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
      const { error } = await supabase
        .from("findings")
        .update({
          written_name: editValues.genstand,
          material: editValues.materiale,
          dating: editValues.datering,
          easting: editValues.oest ? Number(editValues.oest) : null,
          northing: editValues.nord ? Number(editValues.nord) : null,
          dime_id: editValues.dime_id || null,
        })
        .eq("id", selectedFinding.id);

      if (!error) {
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (selectedFinding) {
      setEditValues({ ...selectedFinding });
    }
  };

  const handleMapClick = (e: MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    if (zoom >= PLACE_MARKER_ZOOM && editValues) {
      const { easting, northing } = wgs84ToUTM(lng, lat);
      handleEditChange("oest", easting);
      handleEditChange("nord", northing);
    }
  };

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
      setIsEditing(false);
      return;
    }

    const findingFromRoute = findings.find((f) => f.id === routeFindingId);
    if (!findingFromRoute) return;

    setSelectedFindingId(findingFromRoute.id);
    setEditValues({ ...findingFromRoute });
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
        <div className="my-findings__sidebar">
          <p className="my-findings__count">
            {t("myFindings.count", { count: findings.length })}
          </p>
          <div className="my-findings__search">
            <svg
              className="my-findings__search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              className="my-findings__search-input"
              type="search"
              placeholder={t("myFindings.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <span className="my-findings__search-results">
                {t("myFindings.searchResults", {
                  count: filteredFindings.length,
                })}
              </span>
            )}
          </div>
          <div className="my-findings__list">
            {filteredFindings.map((f) => {
              const name = f.genstand || (f as any).written_name;
              const isSelected = selectedFindingId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => handleSelectFinding(f.id)}
                  className={`my-findings__card ${
                    isSelected ? "my-findings__card--selected" : ""
                  }`}
                >
                  <div className="my-findings__card-header">
                    <p className="my-findings__card-title">
                      {name ?? (
                        <span className="my-findings__card-title--unnamed">
                          {t("myFindings.unnamed")}
                        </span>
                      )}
                    </p>
                    <span
                      className="my-findings__card-chevron"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </div>
                  <div className="my-findings__card-footer">
                    <div className="my-findings__card-badges">
                      {f.materiale && (
                        <span className="my-findings__badge my-findings__badge--material">
                          {f.materiale}
                        </span>
                      )}
                      {f.datering && (
                        <span className="my-findings__badge my-findings__badge--dating">
                          {f.datering}
                        </span>
                      )}
                      {f.dime_id && (
                        <span className="my-findings__badge my-findings__badge--dime">
                          {t("myFindings.dimeIdLabel")}: {f.dime_id}
                        </span>
                      )}
                    </div>
                    <span className="my-findings__card-date">
                      {formatDate(f.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="my-findings__detail">
          {selectedFinding && editValues ? (
            <div className="my-findings__detail-content">
              <div className="my-findings__detail-header">
                <h2 className="my-findings__detail-title">
                  {editValues.genstand ||
                    editValues.materiale ||
                    t("myFindings.unnamed")}
                </h2>
              </div>
              <div className="my-findings__detail-view">
                <div className="my-findings__detail-fields">
                  <div className="my-findings__detail-field">
                    <span className="my-findings__detail-label">
                      {t("registerFinding.genstand")}
                    </span>
                    <span className="my-findings__detail-value">
                      {editValues.genstand || "—"}
                    </span>
                  </div>
                  <div className="my-findings__detail-field">
                    <span className="my-findings__detail-label">
                      {t("registerFinding.materiale")}
                    </span>
                    <span className="my-findings__detail-value">
                      {editValues.materiale || "—"}
                    </span>
                  </div>
                  <div className="my-findings__detail-field">
                    <span className="my-findings__detail-label">
                      {t("registerFinding.datering")}
                    </span>
                    <span className="my-findings__detail-value">
                      {editValues.datering || "—"}
                    </span>
                  </div>
                  {(editValues.oest || editValues.nord) && (
                    <>
                      <div className="my-findings__detail-field">
                        <span className="my-findings__detail-label">
                          {t("registerFinding.oest")}
                        </span>
                        <span className="my-findings__detail-value">
                          {editValues.oest || "—"}
                        </span>
                      </div>
                      <div className="my-findings__detail-field">
                        <span className="my-findings__detail-label">
                          {t("registerFinding.nord")}
                        </span>
                        <span className="my-findings__detail-value">
                          {editValues.nord || "—"}
                        </span>
                      </div>
                    </>
                  )}
                  {editValues.dime_id && (
                    <div className="my-findings__detail-field">
                      <span className="my-findings__detail-label">
                        {t("registerFinding.dimeId")}
                      </span>
                      <span className="my-findings__detail-value">
                        {editValues.dime_id}
                      </span>
                    </div>
                  )}
                </div>

                {editValues.oest != null &&
                  editValues.nord != null &&
                  isValidUTM(
                    Number(editValues.oest),
                    Number(editValues.nord),
                  ) && (
                    <div className="my-findings__detail-map-container">
                      <div className="my-findings__detail-map">
                        {(() => {
                          const findingsWithCoords =
                            getFindingsWithCoordinates(findings);
                          const selectedWithCoords =
                            selectedFinding &&
                            selectedFinding.oest != null &&
                            selectedFinding.nord != null &&
                            isValidUTM(
                              Number(selectedFinding.oest),
                              Number(selectedFinding.nord),
                            )
                              ? {
                                  ...selectedFinding,
                                  lng: utmToWGS84(
                                    Number(selectedFinding.oest),
                                    Number(selectedFinding.nord),
                                  )[0],
                                  lat: utmToWGS84(
                                    Number(selectedFinding.oest),
                                    Number(selectedFinding.nord),
                                  )[1],
                                }
                              : undefined;
                          const bounds = calculateMapBounds(
                            findingsWithCoords,
                            selectedWithCoords,
                          );
                          return (
                            <Map
                              ref={isEditing ? undefined : mapRef}
                              initialViewState={{
                                longitude: bounds.center[0],
                                latitude: bounds.center[1],
                                zoom: bounds.zoom,
                              }}
                              style={{ width: "100%", height: "100%" }}
                              mapStyle={SATELLITE_STYLE}
                              interactive
                              dragRotate={false}
                              pitchWithRotate={false}
                              maxPitch={0}
                            >
                              {findingsWithCoords.map((f) => {
                                const isSelected = f.id === selectedFinding?.id;
                                return (
                                  <Marker
                                    key={f.id}
                                    longitude={f.lng}
                                    latitude={f.lat}
                                    anchor="bottom"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={isSelected ? 28 : 20}
                                      height={isSelected ? 28 : 20}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill={isSelected ? "#e63946" : "#888"}
                                        stroke="#fff"
                                        strokeWidth="1"
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                      />
                                    </svg>
                                  </Marker>
                                );
                              })}
                            </Map>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                <div className="my-findings__detail-actions">
                  <Button onClick={() => setIsEditing(true)} variant="primary">
                    Edit
                  </Button>
                </div>
              </div>

              {isEditing && (
                <div
                  className="my-findings__modal"
                  role="dialog"
                  aria-modal="true"
                >
                  <div
                    className="my-findings__modal-backdrop"
                    onClick={handleCancel}
                  />
                  <div className="my-findings__modal-content">
                    <div className="my-findings__modal-header">
                      <h3 className="my-findings__modal-title">
                        {editValues.genstand ||
                          editValues.materiale ||
                          t("myFindings.unnamed")}
                      </h3>
                      <button
                        className="my-findings__modal-close"
                        onClick={handleCancel}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="my-findings__detail-edit">
                      <div className="my-findings__detail-form">
                        <TextInput
                          label={t("registerFinding.genstand")}
                          value={editValues.genstand || ""}
                          onChange={(e) =>
                            handleEditChange("genstand", e.target.value)
                          }
                          size="md"
                        />
                        <TextInput
                          label={t("registerFinding.materiale")}
                          value={editValues.materiale || ""}
                          onChange={(e) =>
                            handleEditChange("materiale", e.target.value)
                          }
                          size="md"
                        />
                        <TextInput
                          label={t("registerFinding.datering")}
                          value={editValues.datering || ""}
                          onChange={(e) =>
                            handleEditChange("datering", e.target.value)
                          }
                          size="md"
                        />
                        <TextInput
                          label={t("registerFinding.oest")}
                          value={editValues.oest?.toString() || ""}
                          onChange={(e) =>
                            handleEditChange("oest", e.target.value)
                          }
                          size="md"
                        />
                        <TextInput
                          label={t("registerFinding.nord")}
                          value={editValues.nord?.toString() || ""}
                          onChange={(e) =>
                            handleEditChange("nord", e.target.value)
                          }
                          size="md"
                        />
                        <TextInput
                          label={t("registerFinding.dimeId")}
                          value={editValues.dime_id || ""}
                          onChange={(e) =>
                            handleEditChange("dime_id", e.target.value)
                          }
                          size="md"
                        />
                      </div>

                      <div className="my-findings__detail-map-container">
                        <div className="my-findings__detail-map">
                          {(() => {
                            const findingsWithCoords =
                              getFindingsWithCoordinates(findings);
                            const selectedWithCoords =
                              selectedFinding &&
                              selectedFinding.oest != null &&
                              selectedFinding.nord != null &&
                              isValidUTM(
                                Number(selectedFinding.oest),
                                Number(selectedFinding.nord),
                              )
                                ? {
                                    ...selectedFinding,
                                    lng: utmToWGS84(
                                      Number(selectedFinding.oest),
                                      Number(selectedFinding.nord),
                                    )[0],
                                    lat: utmToWGS84(
                                      Number(selectedFinding.oest),
                                      Number(selectedFinding.nord),
                                    )[1],
                                  }
                                : undefined;
                            const bounds = calculateMapBounds(
                              findingsWithCoords,
                              selectedWithCoords,
                            );
                            return (
                              <Map
                                ref={mapRef}
                                initialViewState={{
                                  longitude: bounds.center[0],
                                  latitude: bounds.center[1],
                                  zoom: bounds.zoom,
                                }}
                                style={{ width: "100%", height: "100%" }}
                                mapStyle={SATELLITE_STYLE}
                                interactive
                                dragRotate={false}
                                pitchWithRotate={false}
                                maxPitch={0}
                                onClick={handleMapClick}
                                onZoom={(e: ViewStateChangeEvent) =>
                                  setZoom(e.viewState.zoom)
                                }
                              >
                                {findingsWithCoords.map((f) => {
                                  const isSelected =
                                    f.id === selectedFinding?.id;
                                  return (
                                    <Marker
                                      key={f.id}
                                      longitude={f.lng}
                                      latitude={f.lat}
                                      anchor="bottom"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={isSelected ? 28 : 20}
                                        height={isSelected ? 28 : 20}
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          fill={isSelected ? "#e63946" : "#888"}
                                          stroke="#fff"
                                          strokeWidth="1"
                                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                        />
                                      </svg>
                                    </Marker>
                                  );
                                })}
                              </Map>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="my-findings__detail-actions">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          variant="primary"
                        >
                          {saving ? "Saving..." : t("registerFinding.save")}
                        </Button>
                        <Button onClick={handleCancel} variant="secondary">
                          {t("registerFinding.cancel")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="my-findings__detail-empty">
              <svg
                className="my-findings__detail-empty-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 19 8 12 15 5" />
              </svg>
              <p className="my-findings__detail-empty-text">
                {t("myFindings.selectToView")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFindingsPage;
