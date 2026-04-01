import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb, Modal, Tabs } from "fundbrdet-ui";
import RegisterFindingForm from "../../components/RegisterFindingForm/RegisterFindingForm";
import ImportFindingForm from "../../components/ImportFindingForm/ImportFindingForm";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAllFindingsHeatmap } from "../../hooks/useFindings";
import "./HomePage.css";

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
  },
  layers: [
    {
      id: "satellite",
      type: "raster",
      source: "satellite",
    },
  ],
};

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);
  const heatData = useAllFindingsHeatmap();

  return (
    <div className="home-page">
      <header className="home-page__header">
        <span className="home-page__header-icon">🪙</span>
      </header>

      <main className="home-page__main">
        <Breadcrumb
          className="page-breadcrumb"
          items={[{ label: t("breadcrumb.home"), current: true }]}
        />
        <div className="home-page__main-content">
          <div className="home-page__nav-cards">
            <Link
              to="/detector/my-findings"
              className="home-page__card home-page__card--link"
            >
              <p className="home-page__card-title">{t("home.myFindings")}</p>
              <p className="home-page__card-desc">{t("home.myFindingsDesc")}</p>
            </Link>

            <button
              onClick={() => setCreateOpen(true)}
              className="home-page__card"
            >
              <p className="home-page__card-title">{t("home.createFinding")}</p>
              <p className="home-page__card-desc">
                {t("home.createFindingDesc")}
              </p>
            </button>
          </div>

          <div className="home-page__map-section">
            <div className="home-page__map-container">
              <h2 className="home-page__map-title">{t("home.mapTitle")}</h2>
              <div className="home-page__map">
                <div className="home-page__map-canvas">
                  <Map
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
        </div>
      </main>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="full"
        className="home-page__modal"
        hideCloseButton
      >
        <Tabs
          defaultValue="register"
          variant="line"
          size="md"
          className="home-page__tabs"
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
};

export default HomePage;
