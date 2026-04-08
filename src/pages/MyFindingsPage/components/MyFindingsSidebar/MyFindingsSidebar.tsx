import { useTranslation } from "react-i18next";
import type { Finding } from "../../../../hooks/useFindings";
import { formatDate } from "../../myFindingsUtils";

export const MyFindingsSidebar: React.FC<{
  findings: Finding[];
  filteredFindings: Finding[];
  query: string;
  selectedFindingId: string | null;
  onQueryChange: (value: string) => void;
  onSelectFinding: (findingId: string) => void;
}> = ({
  findings,
  filteredFindings,
  query,
  selectedFindingId,
  onQueryChange,
  onSelectFinding,
}) => {
  const { t } = useTranslation();

  return (
    <div className="my-findings__sidebar">
      <p className="my-findings__count">
        {t("myFindings.count", { count: findings.length })}
      </p>
      <div className="my-findings__search">
        <svg
          className="my-findings__search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          className="my-findings__search-input"
          type="search"
          placeholder={t("myFindings.searchPlaceholder")}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <span className="my-findings__search-results">
            {t("myFindings.searchResults", {
              count: filteredFindings.length,
            })}
          </span>
        )}
      </div>
      <div className="my-findings__list">
        {filteredFindings.map((finding) => {
          const name = finding.genstand;
          const isSelected = selectedFindingId === finding.id;

          return (
            <div
              key={finding.id}
              onClick={() => onSelectFinding(finding.id)}
              className={`my-findings__card ${
                isSelected ? "my-findings__card--selected" : ""
              }`}
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
                  {finding.accessLevel === "shared" && (
                    <span className="my-findings__badge my-findings__badge--shared">
                      {t("myFindings.sharedBadge")}
                    </span>
                  )}
                  {finding.materiale && (
                    <span className="my-findings__badge my-findings__badge--material">
                      {finding.materiale}
                    </span>
                  )}
                  {finding.datering && (
                    <span className="my-findings__badge my-findings__badge--dating">
                      {finding.datering}
                    </span>
                  )}
                  {finding.dime_id && (
                    <span className="my-findings__badge my-findings__badge--dime">
                      {t("myFindings.dimeIdLabel")}: {finding.dime_id}
                    </span>
                  )}
                </div>
                <span className="my-findings__card-date">
                  {formatDate(finding.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyFindingsSidebar;
