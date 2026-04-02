import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Breadcrumb } from "fundbrdet-ui";
import { useMap } from "../../components/AppShell/AppShell";
import proj4 from "proj4";
import { useUserFindings } from "../../hooks/useFindings";
import "./MyFindingsPage.css";

const WGS84 = "EPSG:4326";
const UTM32N = "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs";

function utmToWGS84(easting: number, northing: number): [number, number] {
  const [lng, lat] = proj4(UTM32N, WGS84, [easting, northing]);
  return [lng, lat];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const MyFindingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { findings, loading } = useUserFindings();
  const { flyTo } = useMap();

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: "/detector/home" },
        { label: t("breadcrumb.myFindings"), current: true },
      ]}
    />
  );

  if (loading) {
    return (
      <div className="my-findings">
        {breadcrumb}
        <div className="my-findings__list">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="my-findings__card my-findings__card--skeleton"
            />
          ))}
        </div>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="my-findings">
        {breadcrumb}
        <div className="my-findings__empty">
          <svg
            className="my-findings__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
            <path d="M11 8v3" />
            <path d="M11 14h.01" />
          </svg>
          <p className="my-findings__empty-title">
            {t("myFindings.emptyTitle")}
          </p>
          <p className="my-findings__empty-text">{t("myFindings.empty")}</p>
          <Link
            to="/detector/create-finding"
            className="my-findings__empty-cta"
          >
            {t("myFindings.registerFirst")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-findings">
      {breadcrumb}
      <p className="my-findings__count">
        {t("myFindings.count", { count: findings.length })}
      </p>
      <div className="my-findings__list">
        {findings.map((f) => {
          const name = f.genstand || (f as any).written_name;
          const hasLocation = f.oest != null && f.nord != null;
          return (
            <div
              key={f.id}
              onClick={() => {
                if (hasLocation) {
                  const [lng, lat] = utmToWGS84(f.oest!, f.nord!);
                  flyTo(lng, lat);
                }
              }}
              className="my-findings__card"
            >
              <div className="my-findings__card-header">
                <p className="my-findings__card-title">
                  {name ?? (
                    <span className="my-findings__card-title--unnamed">
                      {t("myFindings.unnamed")}
                    </span>
                  )}
                </p>
                <span className="my-findings__card-chevron" aria-hidden="true">
                  ›
                </span>
              </div>
              <div className="my-findings__card-footer">
                <div className="my-findings__card-badges">
                  {f.materiale && (
                    <span className="my-findings__badge my-findings__badge--material">
                      {f.materiale}
                    </span>
                  )}
                  {f.datering && (
                    <span className="my-findings__badge my-findings__badge--dating">
                      {f.datering}
                    </span>
                  )}
                  {f.datering && (
                    <span className="my-findings__badge my-findings__badge--location">
                      {f.datering}
                    </span>
                  )}
                  {f.dime_id && (
                    <span className="my-findings__badge my-findings__badge--dime">
                      {t("myFindings.dimeIdLabel")}: {f.dime_id}
                    </span>
                  )}
                </div>
                <span className="my-findings__card-date">
                  {formatDate(f.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyFindingsPage;
