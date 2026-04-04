import type { RefObject } from "react";
import Map, {
  Marker,
  type MapMouseEvent,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  SATELLITE_STYLE,
  type FindingWithCoordinates,
} from "../../myFindingsUtils";

export const MyFindingsMap: React.FC<{
  findings: FindingWithCoordinates[];
  selectedFindingId?: string | null;
  mapRef?: RefObject<MapRef | null>;
  center: [number, number];
  zoom: number;
  interactive: boolean;
  onClick?: (event: MapMouseEvent) => void;
  onZoom?: (event: ViewStateChangeEvent) => void;
}> = ({
  findings,
  selectedFindingId,
  mapRef,
  center,
  zoom,
  interactive,
  onClick,
  onZoom,
}) => {
  return (
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
      dragRotate={false}
      pitchWithRotate={false}
      maxPitch={0}
      onClick={onClick}
      onZoom={onZoom}
    >
      {findings.map((finding) => {
        const isSelected = finding.id === selectedFindingId;

        return (
          <Marker
            key={finding.id}
            longitude={finding.lng}
            latitude={finding.lat}
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
};

export default MyFindingsMap;
