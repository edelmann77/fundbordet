import { useTranslation } from "react-i18next";
import { Breadcrumb } from "fundbrdet-ui";
import { useMap } from "../../components/AppShell/AppShell";
import proj4 from "proj4";
import { useUserFindings } from "../../hooks/useFindings";
import "./MyFindingsPage.css";

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

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: "/detector/home" },
        { label: t("breadcrumb.myFindings"), current: true },
      ]}
    />
  );

  if (findings.length === 0) {
    return (
      <div className="my-findings">
        {breadcrumb}
        <p className="my-findings__empty">{t("myFindings.empty")}</p>
      </div>
    );
  }

  return (
    <div className="my-findings">
      {breadcrumb}
      <div className="my-findings__list">
        {findings.map((f) => (
          <div
            key={f.id}
            onClick={() => {
              if (f.oest != null && f.nord != null) {
                const [lng, lat] = utmToWGS84(f.oest, f.nord);
                flyTo(lng, lat);
              }
            }}
            className="my-findings__card"
          >
            <p className="my-findings__card-title">
              {f.genstand || (f as any).written_name || (
                <span className="my-findings__card-title--unnamed">
                  {t("myFindings.unnamed")}
                </span>
              )}
            </p>
            <div className="my-findings__card-meta">
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
