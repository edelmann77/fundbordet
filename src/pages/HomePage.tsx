import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Modal, Tabs } from "fundbrdet-ui";
import RegisterFindingForm from "../components/RegisterFindingForm";
import ImportFindingForm from "../components/ImportFindingForm";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
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

const cardClass =
  "w-full max-w-sm text-left rounded-xl border border-edge bg-surface hover:bg-black/5 transition-colors px-6 py-4";

export default function HomePage() {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const [heatData, setHeatData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("findings")
        .select("easting,northing")
        .not("easting", "is", null)
        .not("northing", "is", null);
      console.log(data);
      if (data && !error) {
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-ink flex items-center px-6 shrink-0">
        <span className="text-xl">🪙</span>
      </header>

      <main className="flex-1 flex items-center">
        {/* Navigation cards */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Link
            to="/detector/my-findings"
            className={`${cardClass} no-underline`}
          >
            <p className="font-semibold text-ink text-base">
              {t("home.myFindings")}
            </p>
            <p className="text-sm text-ink-muted mt-0.5">
              {t("home.myFindingsDesc")}
            </p>
          </Link>

          <button onClick={() => setCreateOpen(true)} className={cardClass}>
            <p className="font-semibold text-ink text-base">
              {t("home.createFinding")}
            </p>
            <p className="text-sm text-ink-muted mt-0.5">
              {t("home.createFindingDesc")}
            </p>
          </button>
        </div>

        {/* Map */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-ink text-center">
              {t("home.mapTitle")}
            </h2>
            <div className="w-full" style={{ height: "60vh" }}>
              <Map
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

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="full"
        className="h-157"
        hideCloseButton
      >
        <Tabs
          defaultValue="register"
          variant="line"
          size="md"
          className="h-full"
          tabs={[
            {
              value: "register",
              label: t("home.tabs.register"),
              children: (
                <RegisterFindingForm
                  key={String(createOpen)}
                  onCancel={() => setCreateOpen(false)}
                  onSubmit={() => setCreateOpen(false)}
                />
              ),
            },
            {
              value: "import",
              label: t("home.tabs.import"),
              children: (
                <ImportFindingForm
                  onCancel={() => setCreateOpen(false)}
                  onSubmit={() => setCreateOpen(false)}
                />
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
}
