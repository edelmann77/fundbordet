import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Map, { Source, Layer, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, createContext, useContext } from "react";
import { useAllFindingsHeatmap } from "../../hooks/useFindings";
import "./AppShell.css";

const SATELLITE_STYLE = {
  version: 8,
  sources: {
    satellite: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
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
  ],
};

interface MapContextType {
  flyTo: (lng: number, lat: number) => void;
}
const MapContext = createContext<MapContextType | null>(null);

export const useMap = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within AppShell");
  return ctx;
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const heatData = useAllFindingsHeatmap();
  const mapRef = useRef<MapRef>(null);

  const navItems = [
    { to: "/detector/my-findings", label: t("appShell.nav.myFindings") },
    { to: "/detector/create-finding", label: t("appShell.nav.createFinding") },
  ];

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <span className="app-shell__logo">🪙</span>
        <nav className="app-shell__nav">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "app-shell__nav-link",
                  isActive ? "app-shell__nav-link--active" : "",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-shell__main">
        <MapContext.Provider
          value={{
            flyTo: (lng, lat) => {
              const map = mapRef.current;
              if (map) {
                map.flyTo({ center: [lng, lat], zoom: 14, duration: 1500 });
              }
            },
          }}
        >
          <div className="app-shell__content">{children}</div>
        </MapContext.Provider>

        <div className="app-shell__map-section">
          <div className="app-shell__map-container">
            <h2 className="app-shell__map-title">{t("appShell.mapTitle")}</h2>
            <div className="app-shell__map">
              <div className="app-shell__map-canvas">
                <Map
                  ref={mapRef}
                  initialViewState={{
                    longitude: 11.5,
                    latitude: 56.2,
                    zoom: 6,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  mapStyle={SATELLITE_STYLE}
                  interactive={false}
                >
                  {heatData && (
                    <>
                      <Source id="heat" type="geojson" data={heatData} />
                      <Layer
                        id="heatLayer"
                        type="heatmap"
                        source="heat"
                        paint={{
                          "heatmap-weight": 1,
                          "heatmap-intensity": 1,
                          "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0,
                            "rgba(33,102,172,0)",
                            0.2,
                            "rgb(103,169,207)",
                            0.4,
                            "rgb(209,229,240)",
                            0.6,
                            "rgb(253,219,199)",
                            0.8,
                            "rgb(239,138,98)",
                            1,
                            "rgb(178,24,43)",
                          ],
                          "heatmap-radius": 20,
                          "heatmap-opacity": 0.6,
                        }}
                      />
                    </>
                  )}
                </Map>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppShell;
