import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Tabs } from "fundbrdet-ui";
import RegisterFindingForm from "../../components/RegisterFindingForm/RegisterFindingForm";
import ImportFindingForm from "../../components/ImportFindingForm/ImportFindingForm";
import AccountMenu from "../../components/AccountMenu/AccountMenu";
import NotificationsMenu from "../../components/NotificationsMenu/NotificationsMenu";
import LanguageMenu from "../../components/LanguageMenu/LanguageMenu";
import Map, { Source, Layer, Marker, Popup } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAllFindingsHeatmap } from "../../hooks/useFindings";
import { routes } from "../../lib/routes";
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

const MARKER_ZOOM_THRESHOLD = 10;

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [zoom, setZoom] = useState(7);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    lng: number;
    lat: number;
    id: string;
    genstand: string | null;
    datering: string | null;
  } | null>(null);
  const heatData = useAllFindingsHeatmap();

  const handleOpenCreate = () => setCreateOpen(true);
  const handleCloseCreate = () => setCreateOpen(false);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const handleMove = useCallback((evt: { viewState: { zoom: number } }) => {
    setZoom(evt.viewState.zoom);
  }, []);

  const showMarkers = zoom >= MARKER_ZOOM_THRESHOLD;

  return (
    <div className="home-page">
      <header className="home-page__header">
        <span className="home-page__header-icon">🪙</span>
        <nav className="home-page__header-nav">
          <Link to={routes.myFindings} className="home-page__header-nav-link">
            {t("home.myFindings")}
          </Link>
          <Link
            to={routes.sharedFindings}
            className="home-page__header-nav-link"
          >
            {t("home.sharedFindings")}
          </Link>
          <Link to={routes.fundDatabase} className="home-page__header-nav-link">
            {t("home.fundDatabase")}
          </Link>
        </nav>
        <div className="home-page__header-actions">
          <LanguageMenu />
          <NotificationsMenu />
          <AccountMenu />
        </div>
      </header>

      <main className="home-page__main">
        <Map
          initialViewState={{
            bounds: [8.0, 54.5, 15.2, 57.8],
            fitBoundsOptions: { padding: 40 },
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={SATELLITE_STYLE}
          interactive
          onLoad={handleMapLoad}
          onMove={handleMove}
          onClick={() => setPopupInfo(null)}
        >
          {mapLoaded && heatData && (
            <>
              <Source id="heat" type="geojson" data={heatData} />
              <Layer
                id="heatLayer"
                type="heatmap"
                source="heat"
                maxzoom={MARKER_ZOOM_THRESHOLD}
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

          {mapLoaded &&
            heatData &&
            showMarkers &&
            heatData.features.map((f) => {
              const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
              const { id, genstand, datering } = f.properties as {
                id: string;
                genstand: string | null;
                datering: string | null;
              };
              return (
                <Marker
                  key={id}
                  longitude={lng}
                  latitude={lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo({ lng, lat, id, genstand, datering });
                  }}
                >
                  <div className="home-page__marker" />
                </Marker>
              );
            })}

          {popupInfo && (
            <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              anchor="bottom"
              offset={20}
              closeButton={false}
              onClose={() => setPopupInfo(null)}
            >
              <div className="home-page__popup">
                <p className="home-page__popup-title">
                  {popupInfo.genstand ?? t("finding.unknownType")}
                </p>
                {popupInfo.datering && (
                  <p className="home-page__popup-sub">{popupInfo.datering}</p>
                )}
                <button
                  className="home-page__popup-link"
                  onClick={() => navigate(routes.myFinding(popupInfo.id))}
                >
                  {t("home.viewFinding")}
                </button>
              </div>
            </Popup>
          )}
        </Map>

        <button
          onClick={handleOpenCreate}
          className="home-page__fab"
          aria-label={t("home.createFinding")}
        >
          <span className="home-page__fab-icon">+</span>
          {t("home.createFinding")}
        </button>
      </main>

      <Modal
        open={createOpen}
        onClose={handleCloseCreate}
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
                  onCancel={handleCloseCreate}
                  onSubmit={handleCloseCreate}
                />
              ),
            },
            {
              value: "import",
              label: t("home.tabs.import"),
              children: (
                <ImportFindingForm
                  onCancel={handleCloseCreate}
                  onSubmit={handleCloseCreate}
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
