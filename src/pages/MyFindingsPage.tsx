import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { useMap } from "../components/AppShell";
import proj4 from "proj4";

interface Finding {
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

export default function MyFindingsPage() {
  const { t } = useTranslation();
  const [findings, setFindings] = useState<Finding[]>([]);
  const { flyTo } = useMap();

  const WGS84 = "EPSG:4326";
  const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";
  function utmToWGS84(easting: number, northing: number): [number, number] {
    const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
    return [lng, lat];
  }

  useEffect(() => {
    const channel = supabase.channel("findings");

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const userId = user.id;

      const fetchFindings = () =>
        supabase
          .schema("public")
          .from("findings")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (data) {
              // convert DB shape to our Finding interface
              const mapped = (data as any[]).map((row) => ({
                ...row,
                oest: row.easting,
                nord: row.northing,
              }));
              setFindings(mapped as Finding[]);
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

  if (findings.length === 0) {
    return <p className="text-ink-muted text-sm">{t("myFindings.empty")}</p>;
  }

  return (
    // limit height relative to viewport to avoid spilling outside AppShell
    <div
      className="w-full flex flex-col gap-2"
      style={{ maxHeight: "calc(100vh - 5rem)" }}
    >
      <div className="flex-1 overflow-auto">
        {findings.map((f) => (
          <div
            key={f.id}
            onClick={() => {
              if (f.oest != null && f.nord != null) {
                const [lng, lat] = utmToWGS84(f.oest, f.nord);
                flyTo(lng, lat);
              }
            }}
            className="rounded-xl border border-edge bg-surface px-5 py-4 flex flex-col gap-1 cursor-pointer"
          >
            <p className="font-semibold text-ink text-sm">
              {f.genstand || (f as any).written_name || (
                <span className="text-ink-muted italic">
                  {t("myFindings.unnamed")}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-muted">
              {f.materiale && <span>{f.materiale}</span>}
              {f.datering && <span>{f.datering}</span>}
              {f.oest != null && f.nord != null && (
                <span>
                  {f.oest}E / {f.nord}N
                </span>
              )}
              {f.dime_id && (
                <span>
                  {t("myFindings.dimeIdLabel")}: {f.dime_id}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
