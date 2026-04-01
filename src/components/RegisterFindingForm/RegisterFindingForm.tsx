import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, Button } from "fundbrdet-ui";
import { supabase } from "../../lib/supabase";
import Map, {
  Marker,
  type MapRef,
  type MapMouseEvent,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import proj4 from "proj4";
import "./RegisterFindingForm.css";

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

const PLACE_MARKER_ZOOM = 14;

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

const toUTM = (
  lng: number,
  lat: number,
): { easting: number; northing: number } => {
  const [easting, northing] = proj4(WGS84, UTM32N, [lng, lat]);
  return { easting: Math.round(easting), northing: Math.round(northing) };
};

const utmToWGS84 = (easting: number, northing: number): [number, number] => {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
};

const isValidUTM = (easting: number, northing: number): boolean => {
  return (
    easting >= 400000 &&
    easting <= 900000 &&
    northing >= 6000000 &&
    northing <= 6800000
  );
};

export const RegisterFindingForm: React.FC<{
  onCancel?: () => void;
  onSubmit?: () => void;
}> = ({ onCancel, onSubmit }) => {
  const { t } = useTranslation();
  const [genstand, setGenstand] = useState("");
  const [materiale, setMateriale] = useState("");
  const [datering, setDatering] = useState("");
  const [oest, setOest] = useState("");
  const [nord, setNord] = useState("");
  const [dimeId, setDimeId] = useState("");
  const [zoom, setZoom] = useState(6);
  const [markerPos, setMarkerPos] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const canvas = mapRef.current?.getCanvas();
    if (!canvas) return;
    canvas.style.cursor = zoom >= PLACE_MARKER_ZOOM ? "crosshair" : "";
  }, [zoom]);

  useEffect(() => {
    const e = Number(oest);
    const n = Number(nord);
    if (!oest || !nord || !isValidUTM(e, n)) return;
    const timer = setTimeout(() => {
      const [lng, lat] = utmToWGS84(e, n);
      const map = mapRef.current;
      if (!map) return;
      const onMoveEnd = () => {
        setMarkerPos({ lng, lat });
        map.off("moveend", onMoveEnd);
      };
      map.on("moveend", onMoveEnd);
      map.flyTo({ center: [lng, lat], zoom: 14, duration: 2500 });
    }, 600);
    return () => clearTimeout(timer);
  }, [oest, nord]);

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("findings").insert({
      user_id: user?.id,
      written_name: genstand,
      material: materiale,
      dating: datering,
      easting: oest ? Number(oest) : null,
      northing: nord ? Number(nord) : null,
      dime_id: dimeId || null,
    });
    if (!error) onSubmit?.();
  };

  const handleMapClick = (e: MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    if (zoom >= PLACE_MARKER_ZOOM) {
      setMarkerPos({ lng, lat });
      const { easting, northing } = toUTM(lng, lat);
      setOest(String(easting));
      setNord(String(northing));
    }
  };

  return (
    <div className="register-finding-form">
      <div className="register-finding-form__body">
        <div className="register-finding-form__fields">
          <TextInput
            label={t("registerFinding.genstand")}
            value={genstand}
            onChange={(e) => setGenstand(e.target.value)}
            size="md"
          />
          <TextInput
            label={t("registerFinding.materiale")}
            value={materiale}
            onChange={(e) => setMateriale(e.target.value)}
            size="md"
          />
          <TextInput
            label={t("registerFinding.datering")}
            value={datering}
            onChange={(e) => setDatering(e.target.value)}
            size="md"
          />
          <TextInput
            label={t("registerFinding.oest")}
            value={oest}
            onChange={(e) => setOest(e.target.value)}
            size="md"
          />
          <TextInput
            label={t("registerFinding.nord")}
            value={nord}
            onChange={(e) => setNord(e.target.value)}
            size="md"
          />
          <TextInput
            label={t("registerFinding.dimeId")}
            value={dimeId}
            onChange={(e) => setDimeId(e.target.value)}
            size="md"
          />
        </div>

        <div className="register-finding-form__map">
          <div className="register-finding-form__map-canvas">
            <Map
              ref={mapRef}
              initialViewState={{ longitude: 11.5, latitude: 56.2, zoom: 5.5 }}
              style={{ width: "100%", height: "100%" }}
              mapStyle={SATELLITE_STYLE}
              onClick={handleMapClick}
              onZoom={(e: ViewStateChangeEvent) => setZoom(e.viewState.zoom)}
            >
              {markerPos && (
                <Marker
                  longitude={markerPos.lng}
                  latitude={markerPos.lat}
                  anchor="bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#e63946"
                      stroke="#fff"
                      strokeWidth="1"
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                  </svg>
                </Marker>
              )}
            </Map>
          </div>
        </div>
      </div>

      <div className="register-finding-form__actions">
        <div className="register-finding-form__actions-group">
          <Button variant="outline" size="md" onClick={onCancel}>
            {t("registerFinding.cancel")}
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {t("registerFinding.save")}
          </Button>
        </div>
        <div className="register-finding-form__map-spacer" />
      </div>
    </div>
  );
};

export default RegisterFindingForm;
