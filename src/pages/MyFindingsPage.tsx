import { useTranslation } from "react-i18next";
import { useMap } from "../components/AppShell";
import proj4 from "proj4";
import { useUserFindings } from "../hooks/useFindings";

export const MyFindingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { findings } = useUserFindings();
  const { flyTo } = useMap();

  const WGS84 = "EPSG:4326";
  const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

  const utmToWGS84 = (easting: number, northing: number): [number, number] => {
    const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
    return [lng, lat];
  };

  if (findings.length === 0) {
    return <p className="text-ink-muted text-sm">{t("myFindings.empty")}</p>;
  }

  return (
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
};

export default MyFindingsPage;
