import { useState, type RefObject } from "react";
import Map, {
  Marker,
  Popup,
  type MapMouseEvent,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { useTranslation } from "react-i18next";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  SATELLITE_STYLE,
  type FindingWithCoordinates,
} from "../../myFindingsUtils";
import "./MyFindingsMap.css";

const FindingMarker: React.FC<{
  finding: FindingWithCoordinates;
  isSelected: boolean;
  ariaLabel: string;
  onMarkerSelect?: (finding: FindingWithCoordinates) => void;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ finding, isSelected, ariaLabel, onMarkerSelect, setHoveredId }) => {
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    onMarkerSelect?.(finding);
  };

  const handleMouseEnter = () => {
    setHoveredId(finding.id);
  };

  const handleMouseLeave = () => {
    setHoveredId((currentId) => (currentId === finding.id ? null : currentId));
  };

  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onMarkerSelect?.(finding);
  };

  return (
    <Marker longitude={finding.lng} latitude={finding.lat} anchor="bottom">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={isSelected ? 28 : 20}
        height={isSelected ? 28 : 20}
        viewBox="0 0 24 24"
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        className="my-findings__map-marker"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
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
};

export const MyFindingsMap: React.FC<{
  findings: FindingWithCoordinates[];
  selectedFindingId?: string | null;
  mapRef?: RefObject<MapRef | null>;
  center: [number, number];
  zoom: number;
  interactive: boolean;
  onClick?: (event: MapMouseEvent) => void;
  onZoom?: (event: ViewStateChangeEvent) => void;
  onMarkerSelect?: (finding: FindingWithCoordinates) => void;
  showFullscreenControl?: boolean;
}> = ({
  findings,
  selectedFindingId,
  mapRef,
  center,
  zoom,
  interactive,
  onClick,
  onZoom,
  onMarkerSelect,
  showFullscreenControl = true,
}) => {
  const { t } = useTranslation();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [hoveredInlineFindingId, setHoveredInlineFindingId] = useState<
    string | null
  >(null);
  const [hoveredModalFindingId, setHoveredModalFindingId] = useState<
    string | null
  >(null);

  const handleOpenModal = () => setIsMapModalOpen(true);
  const handleCloseModal = () => setIsMapModalOpen(false);

  const renderMapOverlays = (variant: "inline" | "modal") => {
    const hoveredFindingId =
      variant === "modal" ? hoveredModalFindingId : hoveredInlineFindingId;
    const hoveredFinding = hoveredFindingId
      ? (findings.find((finding) => finding.id === hoveredFindingId) ?? null)
      : null;
    const showPopover =
      hoveredFinding != null && hoveredFinding.id !== selectedFindingId;
    const setHoveredFindingId =
      variant === "modal"
        ? setHoveredModalFindingId
        : setHoveredInlineFindingId;

    return (
      <>
        {findings.map((finding) => {
          const isSelected = finding.id === selectedFindingId;

          return (
            <FindingMarker
              key={finding.id}
              finding={finding}
              isSelected={isSelected}
              ariaLabel={t("myFindings.markerAriaLabel")}
              onMarkerSelect={onMarkerSelect}
              setHoveredId={setHoveredFindingId}
            />
          );
        })}

        {showPopover && hoveredFinding ? (
          <Popup
            longitude={hoveredFinding.lng}
            latitude={hoveredFinding.lat}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            offset={18}
            className="my-findings__map-popover"
          >
            <div className="my-findings__map-popover-content">
              <p className="my-findings__map-popover-title">
                {hoveredFinding.genstand ||
                  hoveredFinding.materiale ||
                  t("myFindings.unnamed")}
              </p>

              {hoveredFinding.materiale ? (
                <p className="my-findings__map-popover-row">
                  <span>{t("registerFinding.materiale")}: </span>
                  <span>{hoveredFinding.materiale}</span>
                </p>
              ) : null}

              {hoveredFinding.datering ? (
                <p className="my-findings__map-popover-row">
                  <span>{t("registerFinding.datering")}: </span>
                  <span>{hoveredFinding.datering}</span>
                </p>
              ) : null}

              {hoveredFinding.dime_id ? (
                <p className="my-findings__map-popover-row">
                  <span>{t("registerFinding.dimeId")}: </span>
                  <span>{hoveredFinding.dime_id}</span>
                </p>
              ) : null}
            </div>
          </Popup>
        ) : null}
      </>
    );
  };

  return (
    <div className="my-findings__map-shell">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center[0],
          latitude: center[1],
          zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={SATELLITE_STYLE}
        interactive={interactive}
        dragPan={interactive}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        touchZoomRotate={interactive}
        keyboard={interactive}
        dragRotate={false}
        pitchWithRotate={false}
        maxPitch={0}
        onClick={onClick}
        onZoom={onZoom}
      >
        {renderMapOverlays("inline")}
      </Map>

      {showFullscreenControl ? (
        <button
          type="button"
          className="my-findings__map-expand-button"
          aria-label={t("myFindings.mapExpandAriaLabel")}
          onClick={handleOpenModal}
        >
          ⤢
        </button>
      ) : null}

      {isMapModalOpen ? (
        <div className="my-findings__map-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="my-findings__map-modal-backdrop"
            aria-label={t("myFindings.mapCloseAriaLabel")}
            onClick={handleCloseModal}
          />

          <div className="my-findings__map-modal-content">
            <button
              type="button"
              className="my-findings__map-modal-close"
              aria-label={t("myFindings.mapCloseAriaLabel")}
              onClick={handleCloseModal}
            >
              ×
            </button>

            <div className="my-findings__map-modal-map">
              <Map
                ref={mapRef}
                initialViewState={{
                  longitude: center[0],
                  latitude: center[1],
                  zoom,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle={SATELLITE_STYLE}
                interactive
                dragPan
                scrollZoom
                doubleClickZoom
                touchZoomRotate
                keyboard
                dragRotate={false}
                pitchWithRotate={false}
                maxPitch={0}
                onClick={onClick}
                onZoom={onZoom}
              >
                {renderMapOverlays("modal")}
              </Map>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyFindingsMap;
