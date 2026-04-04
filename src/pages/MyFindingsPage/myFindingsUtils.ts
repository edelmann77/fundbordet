import proj4 from "proj4";
import type { StyleSpecification } from "maplibre-gl";
import type { Finding } from "../../hooks/useFindings";

export const SATELLITE_STYLE: StyleSpecification = {
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

export const PLACE_MARKER_ZOOM = 14;

export type FindingWithCoordinates = Finding & { lng: number; lat: number };

export function utmToWGS84(
  easting: number,
  northing: number,
): [number, number] {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
}

export function wgs84ToUTM(
  lng: number,
  lat: number,
): { easting: number; northing: number } {
  const [easting, northing] = proj4(WGS84, UTM32N, [lng, lat]);
  return { easting: Math.round(easting), northing: Math.round(northing) };
}

export function isValidUTM(easting: number, northing: number): boolean {
  return (
    easting >= 400000 &&
    easting <= 900000 &&
    northing >= 6000000 &&
    northing <= 6800000
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getFindingWithCoordinates(
  finding?: Finding | null,
): FindingWithCoordinates | undefined {
  if (
    !finding ||
    finding.oest == null ||
    finding.nord == null ||
    !isValidUTM(Number(finding.oest), Number(finding.nord))
  ) {
    return undefined;
  }

  const [lng, lat] = utmToWGS84(Number(finding.oest), Number(finding.nord));
  return { ...finding, lng, lat };
}

export function getFindingsWithCoordinates(
  findings: Finding[],
): FindingWithCoordinates[] {
  return findings
    .filter((finding) => finding.oest != null && finding.nord != null)
    .filter(
      (finding) =>
        isValidUTM(Number(finding.oest), Number(finding.nord)) &&
        !Number.isNaN(Number(finding.oest)) &&
        !Number.isNaN(Number(finding.nord)),
    )
    .map((finding) => {
      const [lng, lat] = utmToWGS84(Number(finding.oest), Number(finding.nord));
      return { ...finding, lng, lat };
    });
}

export function calculateMapBounds(
  findings: FindingWithCoordinates[],
  selected?: FindingWithCoordinates,
): {
  center: [number, number];
  zoom: number;
} {
  if (selected) {
    return { center: [selected.lng, selected.lat], zoom: 14 };
  }

  if (findings.length === 0) return { center: [11.5, 56.2], zoom: 6 };
  if (findings.length === 1) {
    return { center: [findings[0].lng, findings[0].lat], zoom: 14 };
  }

  const lngs = findings.map((finding) => finding.lng);
  const lats = findings.map((finding) => finding.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return {
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    zoom: 6,
  };
}
