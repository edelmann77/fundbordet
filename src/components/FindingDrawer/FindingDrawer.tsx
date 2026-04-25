import { useTranslation } from "react-i18next";
import "./FindingDrawer.css";

export interface FindingDrawerEntry {
  id: string;
  genstand: string | null;
  materiale: string | null;
  datering: string | null;
  dime_id: string | null;
}

export const FindingDrawer: React.FC<{
  finding: FindingDrawerEntry | null;
  onClose: () => void;
}> = ({ finding, onClose }) => {
  const { t } = useTranslation();

  return (
    <aside
      className={`finding-drawer${finding ? " finding-drawer--open" : ""}`}
    >
      <div className="finding-drawer__header">
        <h2 className="finding-drawer__title">
          {finding?.genstand ?? t("finding.unknownType")}
        </h2>
        <button
          className="finding-drawer__close"
          onClick={onClose}
          aria-label={t("finding.drawer.close")}
        >
          ✕
        </button>
      </div>

      {finding && (
        <dl className="finding-drawer__meta">
          {finding.genstand && (
            <>
              <dt className="finding-drawer__label">
                {t("registerFinding.genstand")}
              </dt>
              <dd className="finding-drawer__value">{finding.genstand}</dd>
            </>
          )}

          {finding.materiale && (
            <>
              <dt className="finding-drawer__label">
                {t("registerFinding.materiale")}
              </dt>
              <dd className="finding-drawer__value">{finding.materiale}</dd>
            </>
          )}

          {finding.datering && (
            <>
              <dt className="finding-drawer__label">
                {t("registerFinding.datering")}
              </dt>
              <dd className="finding-drawer__value">{finding.datering}</dd>
            </>
          )}

          {finding.dime_id && (
            <>
              <dt className="finding-drawer__label">
                {t("registerFinding.dimeId")}
              </dt>
              <dd className="finding-drawer__value">{finding.dime_id}</dd>
            </>
          )}
        </dl>
      )}
    </aside>
  );
};
