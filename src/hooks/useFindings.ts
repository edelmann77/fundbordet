import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import proj4 from "proj4";

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

/**
 * Convert UTM coordinates to WGS84 (lat/lng)
 */
function utmToWGS84(easting: number, northing: number): [number, number] {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
}

/**
 * Finding interface matching Supabase schema
 */
export interface Finding {
  id: string;
  genstand: string | null;
  materiale: string | null;
  datering: string | null;
  // we store coordinates in the DB as `easting`/`northing` but keep the
  // Danish field names in the UI for historical reasons
  oest: number | null;
  nord: number | null;
  dime_id: string | null;
  created_at: string;
}

/**
 * Hook to fetch findings for the current user with real-time subscriptions
 */
export function useUserFindings() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase.channel("findings");

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      const userId = user.id;

      const fetchFindings = () =>
        supabase
          .schema("public")
          .from("findings")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .then(({ data, error: queryError }) => {
            setLoading(false);
            if (queryError) {
              setError(queryError.message);
            } else if (data) {
              // convert DB shape to our Finding interface
              const mapped = (data as any[]).map((row) => ({
                ...row,
                oest: row.easting,
                nord: row.northing,
              }));
              setFindings(mapped as Finding[]);
              setError(null);
            }
          });

      fetchFindings();

      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "findings" },
          fetchFindings,
        )
        .subscribe();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { findings, loading, error };
}

/**
 * Hook to fetch all findings (no user filter) for heatmap display
 */
export function useAllFindingsHeatmap() {
  const [heatData, setHeatData] = useState<GeoJSON.FeatureCollection | null>(
    null,
  );

  useEffect(() => {
    // load all findings coordinates for heatmap
    supabase
      .from("findings")
      .select("easting,northing")
      .not("easting", "is", null)
      .not("northing", "is", null)
      .then(({ data, error }) => {
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

  return heatData;
}

/**
 * Convert UTM finding to WGS84 coordinates for map display
 */
export function findingToCoordinates(
  finding: Finding,
): [number, number] | null {
  if (finding.oest == null || finding.nord == null) return null;
  return utmToWGS84(finding.oest, finding.nord);
}
