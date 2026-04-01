import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import Map, { Marker, type MapRef } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import proj4 from "proj4";
import { Button } from "fundbrdet-ui";
import { supabase } from "../../lib/supabase";
import "./ImportFindingForm.css";

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

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

const utmToWGS84 = (easting: number, northing: number): [number, number] => {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
};

const toUTM = (
  lng: number,
  lat: number,
): { easting: number; northing: number } => {
  const [easting, northing] = proj4(WGS84, UTM32N, [lng, lat]);
  return { easting: Math.round(easting), northing: Math.round(northing) };
};

const isValidUTM = (easting: number, northing: number): boolean => {
  return (
    easting >= 400000 &&
    easting <= 900000 &&
    northing >= 6000000 &&
    northing <= 6800000
  );
};

interface Row {
  genstand: string;
  lng?: number;
  lat?: number;
  materiale: string;
  datering: string;
  øst: string;
  nord: string;
  dimeId: string;
}

export const ImportFindingForm: React.FC<{
  onCancel?: () => void;
  onSubmit?: () => void;
}> = ({ onCancel, onSubmit }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Row[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<MapRef>(null);

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = rows.map((r) => {
      let easting: number | null = null;
      let northing: number | null = null;
      if (r.øst) easting = Number(r.øst);
      if (r.nord) northing = Number(r.nord);
      if (
        (easting == null || northing == null) &&
        r.lng !== undefined &&
        r.lat !== undefined
      ) {
        const utm = toUTM(r.lng, r.lat);
        if (easting == null) easting = utm.easting;
        if (northing == null) northing = utm.northing;
      }
      return {
        user_id: user?.id,
        written_name: r.genstand,
        material: r.materiale,
        dating: r.datering,
        easting,
        northing,
        dime_id: r.dimeId || null,
      };
    });

    const { error } = await supabase.from("findings").insert(payload);
    if (!error) onSubmit?.();
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      const parsed: Row[] = json.map((r) => {
        const genstand = String(r["Genstand"] ?? r["genstand"] ?? "");
        const materiale = String(r["Materiale"] ?? r["materiale"] ?? "");
        const datering = String(r["Datering"] ?? r["dating"] ?? "");
        const oestStr = String(
          r["Øst"] ??
            r["East"] ??
            r["Easting"] ??
            r["easting"] ??
            r["oest"] ??
            "",
        );
        const nordStr = String(
          r["Nord"] ??
            r["North"] ??
            r["Northing"] ??
            r["northing"] ??
            r["nord"] ??
            "",
        );
        const dimeId = String(r["DimeId"] ?? r["dime_id"] ?? r["dime"] ?? "");

        const eastRaw = Number(oestStr);
        const northRaw = Number(nordStr);

        const row: Row = {
          genstand,
          materiale,
          datering,
          øst: oestStr,
          nord: nordStr,
          dimeId,
        };

        if (
          !isNaN(eastRaw) &&
          !isNaN(northRaw) &&
          isValidUTM(eastRaw, northRaw)
        ) {
          const [lng, lat] = utmToWGS84(eastRaw, northRaw);
          row.lng = lng;
          row.lat = lat;
        }
        return row;
      });

      setRows(parsed);

      const withCoords = parsed.filter((r) => r.lng !== undefined);
      if (withCoords.length > 0 && mapRef.current) {
        const lngs = withCoords.map((r) => r.lng!);
        const lats = withCoords.map((r) => r.lat!);
        mapRef.current.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 60, duration: 1500, maxZoom: 16 },
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const withCoords = rows.filter((r) => r.lng !== undefined);

  return (
    <div className="import-finding-form">
      <div className="import-finding-form__body">
        {rows.length ? (
          <div className="import-finding-form__row-list-wrapper">
            <p className="import-finding-form__row-count">
              {t("importFinding.rowCount", { count: rows.length })}
            </p>
            <div className="import-finding-form__row-list">
              {rows.map((row, i) => (
                <div key={i} className="import-finding-form__row">
                  <span className="import-finding-form__row-name">
                    {row.genstand || (
                      <span className="import-finding-form__row-name--unnamed">
                        {t("myFindings.unnamed")}
                      </span>
                    )}
                  </span>
                  {row.lng !== undefined && (
                    <span className="import-finding-form__row-pin">📍</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="import-finding-form__dropzone-wrapper">
            <div
              className={[
                "import-finding-form__dropzone",
                dragging ? "import-finding-form__dropzone--dragging" : "",
              ].join(" ")}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {t("importFinding.dropzone")}
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                className="import-finding-form__file-input"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        <div className="import-finding-form__map">
          <Map
            ref={mapRef}
            initialViewState={{ longitude: 11.5, latitude: 56.2, zoom: 5.5 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle={SATELLITE_STYLE}
            interactive={false}
          >
            {withCoords.map((row, i) => (
              <Marker
                key={i}
                longitude={row.lng!}
                latitude={row.lat!}
                anchor="bottom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
            ))}
          </Map>
        </div>
      </div>

      <div className="import-finding-form__actions">
        <div className="import-finding-form__actions-group">
          <Button variant="outline" size="md" onClick={onCancel}>
            {t("registerFinding.cancel")}
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {t("registerFinding.save")}
          </Button>
        </div>
        <div className="import-finding-form__map-spacer" />
      </div>
    </div>
  );
};

export default ImportFindingForm;
