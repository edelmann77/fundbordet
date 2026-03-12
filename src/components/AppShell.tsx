import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Map, { Source, Layer, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";
import proj4 from "proj4";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWVuNzciLCJhIjoiY21taHF0dWU4MHFnNzJwczZwajg0eGNxcCJ9.jbHXwO95T8UKk1vBHgccyw";

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";
function utmToWGS84(easting: number, northing: number): [number, number] {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
}

// context to allow children to request map movements
interface MapContextType {
  flyTo: (lng: number, lat: number) => void;
}
const MapContext = createContext<MapContextType | null>(null);
export const useMap = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within AppShell");
  return ctx;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const [heatData, setHeatData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    // load all findings coordinates for heatmap
    supabase
      .from("findings")
      .select("easting,northing")
      .not("easting", "is", null)
      .not("northing", "is", null)
      .then(({ data }) => {
        if (data) {
          const features = (data as any[])
            .map((row) => {
              const e = row.easting;
              const n = row.northing;
              if (e == null || n == null) return null;
              const [lng, lat] = utmToWGS84(e, n);
              return {
                type: "Feature",
                geometry: { type: "Point", coordinates: [lng, lat] },
                properties: {},
              };
            })
            .filter(Boolean) as GeoJSON.Feature[];
          setHeatData({ type: "FeatureCollection", features });
        }
      });
  }, []);

  const navItems = [
    { to: "/detector/my-findings", label: t("appShell.nav.myFindings") },
    { to: "/detector/create-finding", label: t("appShell.nav.createFinding") },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 bg-ink flex items-center px-6 gap-8 shrink-0">
        <span className="text-xl">🪙</span>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors no-underline",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 flex items-center">
        {/* Page content */}
        <MapContext.Provider
          value={{
            flyTo: (lng: number, lat: number) => {
              const map = mapRef.current;
              if (map) {
                map.flyTo({ center: [lng, lat], zoom: 14, duration: 1500 });
              }
            },
          }}
        >
          <div className="flex-1 h-full flex items-center justify-center p-8">
            {children}
          </div>
        </MapContext.Provider>

        {/* Map */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-ink text-center">
              {t("appShell.mapTitle")}
            </h2>
            <div className="w-full" style={{ height: "60vh" }}>
              <Map
                ref={mapRef}
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: 11.5,
                  latitude: 56.2,
                  zoom: 6,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
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
      </main>
    </div>
  );
}
