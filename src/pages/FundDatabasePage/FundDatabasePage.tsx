import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumb, ProgressSpinner } from "fundbrdet-ui";
import { FindingComments } from "../../components/FindingComments/FindingComments";
import {
  listConfirmedFriends,
  type FriendRecord,
} from "../../hooks/useFriendSearch";
import {
  getFindingImageUrl,
  useFindingCatalogPreviewImages,
  useFindingsCatalog,
} from "../../hooks/useFindings";
import "./FundDatabasePage.css";

const PAGE_SIZE = 9;

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const FundDatabasePage: React.FC = () => {
  const { t } = useTranslation();
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmedFriends, setConfirmedFriends] = useState<FriendRecord[]>([]);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(
    null,
  );
  const needle = query.trim();
  const { findings, totalCount, loading, error } = useFindingsCatalog(
    page,
    PAGE_SIZE,
    needle,
  );

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  useEffect(() => {
    let isMounted = true;

    const loadConfirmedFriends = async () => {
      try {
        const nextFriends = await listConfirmedFriends();

        if (isMounted) {
          setConfirmedFriends(nextFriends);
        }
      } catch {
        if (isMounted) {
          setConfirmedFriends([]);
        }
      }
    };

    void loadConfirmedFriends();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [needle]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const currentPageFindingIds = useMemo(
    () => findings.map((finding) => finding.id),
    [findings],
  );

  const { previewImages, loading: imagesLoading } =
    useFindingCatalogPreviewImages(currentPageFindingIds);

  const breadcrumb = (
    <Breadcrumb
      className="page-breadcrumb"
      items={[
        { label: t("breadcrumb.home"), href: "/detector/home" },
        { label: t("breadcrumb.fundDatabase"), current: true },
      ]}
    />
  );

  if (loading) {
    return (
      <div className="fund-database">
        {breadcrumb}
        <div className="fund-database__state fund-database__state--loading">
          <ProgressSpinner
            size="lg"
            tone="forest"
            label={t("fundDatabase.loading")}
            showLabel
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fund-database">
      {breadcrumb}

      <section className="fund-database__hero">
        <div>
          <h1 className="fund-database__title">{t("fundDatabase.title")}</h1>
          <p className="fund-database__description">
            {t("fundDatabase.description")}
          </p>
        </div>

        <div className="fund-database__toolbar">
          <p className="fund-database__count">
            {t("fundDatabase.count", { count: totalCount })}
          </p>
          <label className="fund-database__search">
            <span className="fund-database__search-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              className="fund-database__search-input"
              type="search"
              placeholder={t("fundDatabase.searchPlaceholder")}
              value={draftQuery}
              onChange={(event) => {
                const nextValue = event.target.value;

                setDraftQuery(nextValue);

                if (nextValue !== "") {
                  return;
                }

                setPage(1);
                setQuery("");
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter") {
                  return;
                }

                event.preventDefault();
                setPage(1);
                setQuery(draftQuery);
              }}
            />
          </label>
          <p className="fund-database__page-indicator">
            {t("fundDatabase.page", { current: currentPage, total: pageCount })}
          </p>
        </div>
      </section>

      {error && findings.length === 0 ? (
        <div className="fund-database__state">
          <p className="fund-database__message">
            {t("fundDatabase.loadFailed")}
          </p>
        </div>
      ) : null}

      {findings.length === 0 ? (
        <div className="fund-database__state">
          <svg
            className="fund-database__empty-icon"
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
          <p className="fund-database__empty-title">
            {t("fundDatabase.emptyTitle")}
          </p>
          <p className="fund-database__message">{t("fundDatabase.empty")}</p>
        </div>
      ) : (
        <section className="fund-database__results">
          <div className="fund-database__grid">
            {findings.map((finding) => {
              const previewImage = previewImages[finding.id];
              const finderDisplayName =
                [finding.ownerFirstName, finding.ownerLastName]
                  .map((value) => value?.trim() ?? "")
                  .filter(Boolean)
                  .join(" ") ||
                finding.ownerEmail ||
                null;
              const isCommentsOpen = expandedFindingId === finding.id;

              return (
                <article key={finding.id} className="fund-database__card">
                  <div className="fund-database__card-content">
                    <div className="fund-database__card-main">
                      <div className="fund-database__card-header">
                        <div>
                          <h2 className="fund-database__card-title">
                            {finding.genstand ||
                              finding.materiale ||
                              t("myFindings.unnamed")}
                          </h2>
                        </div>
                        {finding.dime_id ? (
                          <span className="fund-database__badge">
                            DimeId: {finding.dime_id}
                          </span>
                        ) : null}
                      </div>

                      <div className="fund-database__meta">
                        {finding.materiale ? (
                          <span className="fund-database__pill">
                            {finding.materiale}
                          </span>
                        ) : null}
                        {finding.datering ? (
                          <span className="fund-database__pill fund-database__pill--dating">
                            {finding.datering}
                          </span>
                        ) : null}
                      </div>

                      <p className="fund-database__registered">
                        {t("fundDatabase.registered")}:{" "}
                        {formatDate(finding.created_at)}
                      </p>
                      {finderDisplayName ? (
                        <p className="fund-database__finder">
                          {t("sharedFindings.foundBy", {
                            finder: finderDisplayName,
                          })}
                        </p>
                      ) : null}
                    </div>

                    {previewImage ? (
                      <div className="fund-database__media">
                        <img
                          className="fund-database__image"
                          src={getFindingImageUrl(previewImage.imageUid)}
                          alt={
                            finding.genstand ||
                            finding.materiale ||
                            t("myFindings.unnamed")
                          }
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="fund-database__media fund-database__media--empty">
                        <span className="fund-database__media-label">
                          {imagesLoading
                            ? t("fundDatabase.loadingImage")
                            : t("fundDatabase.noImage")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="fund-database__comments-actions">
                    <button
                      type="button"
                      className="fund-database__comments-toggle"
                      onClick={() =>
                        setExpandedFindingId((currentId) =>
                          currentId === finding.id ? null : finding.id,
                        )
                      }
                    >
                      {isCommentsOpen ? t("comments.hide") : t("comments.show")}
                    </button>
                  </div>

                  {isCommentsOpen ? (
                    <FindingComments
                      findingId={finding.id}
                      finderUserId={finding.ownerUserId}
                      finderDisplayName={finderDisplayName}
                      friends={confirmedFriends}
                      compact
                    />
                  ) : null}
                </article>
              );
            })}
          </div>

          <nav
            className="fund-database__pagination"
            aria-label={t("fundDatabase.pagination")}
          >
            <button
              type="button"
              className="fund-database__pagination-button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
            >
              {t("fundDatabase.previous")}
            </button>
            <div
              className="fund-database__pagination-status"
              aria-live="polite"
            >
              {t("fundDatabase.page", {
                current: currentPage,
                total: pageCount,
              })}
            </div>
            <button
              type="button"
              className="fund-database__pagination-button"
              onClick={() =>
                setPage((current) => Math.min(pageCount, current + 1))
              }
              disabled={currentPage === pageCount}
            >
              {t("fundDatabase.next")}
            </button>
          </nav>
        </section>
      )}
    </div>
  );
};

export default FundDatabasePage;
