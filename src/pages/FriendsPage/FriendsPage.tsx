import { useEffect, useState, type FormEvent } from "react";
import { Breadcrumb, Button, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import {
  addFriend,
  CONFIRMED_FRIEND_STATUS,
  confirmFriend,
  deleteFriend,
  listCurrentUserFriends,
  type FriendRecord,
  useFriendSearch,
} from "../../hooks/useFriendSearch";
import { routes } from "../../lib/routes";
import "./FriendsPage.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getFriendLabel = (email: string) => {
  const [localPart] = email.split("@");
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const getInitials = (email: string) => {
  const label = getFriendLabel(email);
  const parts = label.split(" ").filter(Boolean);

  return (parts[0]?.[0] ?? email[0] ?? "?") + (parts[1]?.[0] ?? "");
};

export const FriendsPage: React.FC = () => {
  const { t } = useTranslation();
  const { findFriendByEmail } = useFriendSearch();
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);

  const loadFriends = async () => {
    try {
      setFriendsLoading(true);
      const nextFriends = await listCurrentUserFriends();
      setFriends(nextFriends);
    } catch {
      setError(t("friendsPage.loadFailed"));
    } finally {
      setFriendsLoading(false);
    }
  };

  useEffect(() => {
    void loadFriends();
  }, [t]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextEmail = searchInput.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(nextEmail)) {
      setError(t("friendsPage.invalidEmail"));
      return;
    }

    if (friends.some((friend) => friend.email.toLowerCase() === nextEmail)) {
      setError(t("friendsPage.alreadyFriend"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      const match = await findFriendByEmail(nextEmail);

      if (!match) {
        setError(t("friendsPage.notFound"));
        return;
      }

      await addFriend(match.userId);
      await loadFriends();
      setSearchInput("");
    } catch (searchError) {
      if (
        searchError instanceof Error &&
        searchError.message === "SELF_FRIEND"
      ) {
        setError(t("friendsPage.cannotAddSelf"));
        return;
      }

      if (
        searchError instanceof Error &&
        searchError.message === "FRIEND_EXISTS"
      ) {
        setError(t("friendsPage.alreadyFriend"));
        void loadFriends();
        return;
      }

      setError(t("friendsPage.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmFriend = async (friendId: string) => {
    try {
      setActiveFriendId(friendId);
      setError("");
      await confirmFriend(friendId);
      await loadFriends();
    } catch {
      setError(t("friendsPage.updateFailed"));
    } finally {
      setActiveFriendId(null);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      setActiveFriendId(friendId);
      setError("");
      await deleteFriend(friendId);
      await loadFriends();
    } catch {
      setError(t("friendsPage.removeFailed"));
    } finally {
      setActiveFriendId(null);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchInput(event.target.value);
    if (error) {
      setError("");
    }
  };

  const handleConfirmFriendClick = (friendId: string) => () =>
    handleConfirmFriend(friendId);
  const handleRemoveFriendClick = (friendId: string) => () =>
    handleRemoveFriend(friendId);

  return (
    <div className="friends-page">
      <Breadcrumb
        className="page-breadcrumb"
        items={[
          { label: t("breadcrumb.home"), href: routes.home },
          { label: t("breadcrumb.friends"), current: true },
        ]}
      />

      <main className="friends-page__main">
        <section className="friends-page__hero">
          <div>
            <p className="friends-page__eyebrow">{t("friendsPage.eyebrow")}</p>
            <h1 className="friends-page__title">{t("friendsPage.title")}</h1>
            <p className="friends-page__description">
              {t("friendsPage.description")}
            </p>
          </div>
          <span className="friends-page__badge">
            {t("friendsPage.previewBadge")}
          </span>
        </section>

        <div className="friends-page__grid">
          <section className="friends-page__panel">
            <h2 className="friends-page__section-title">
              {t("friendsPage.searchTitle")}
            </h2>
            <p className="friends-page__section-description">
              {t("friendsPage.searchDescription")}
            </p>

            <form
              className="friends-page__search-form"
              onSubmit={handleSearchSubmit}
            >
              <TextInput
                label={t("friendsPage.searchLabel")}
                type="email"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder={t("friendsPage.searchPlaceholder")}
                size="md"
                disabled={loading}
              />

              <div className="friends-page__search-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                >
                  {t("friendsPage.searchButton")}
                </Button>
              </div>
            </form>

            <p className="friends-page__search-hint">
              {t("friendsPage.searchHint")}
            </p>

            {error && (
              <div role="alert" className="friends-page__error">
                {error}
              </div>
            )}
          </section>

          <section className="friends-page__panel">
            <div className="friends-page__section-header">
              <div>
                <h2 className="friends-page__section-title">
                  {t("friendsPage.friendsTitle")}
                </h2>
                <p className="friends-page__section-description">
                  {t("friendsPage.friendsDescription")}
                </p>
              </div>
              <p className="friends-page__count">
                {friendsLoading
                  ? t("friendsPage.loadingList")
                  : t("friendsPage.friendsCount", { count: friends.length })}
              </p>
            </div>

            {!friendsLoading && friends.length === 0 ? (
              <div className="friends-page__empty-state">
                <p className="friends-page__empty-title">
                  {t("friendsPage.emptyTitle")}
                </p>
                <p className="friends-page__empty-description">
                  {t("friendsPage.emptyDescription")}
                </p>
              </div>
            ) : (
              <ul className="friends-page__list">
                {friends.map((friend) => (
                  <li key={friend.id} className="friends-page__friend-item">
                    <div className="friends-page__friend-meta">
                      <div className="friends-page__avatar" aria-hidden="true">
                        {getInitials(friend.email)}
                      </div>
                      <div className="friends-page__friend-copy">
                        <p className="friends-page__friend-name">
                          {getFriendLabel(friend.email)}
                        </p>
                        <p className="friends-page__friend-email">
                          {friend.email}
                        </p>
                        <div className="friends-page__friend-status-row">
                          <span
                            className={
                              friend.status === CONFIRMED_FRIEND_STATUS
                                ? "friends-page__status-badge friends-page__status-badge--confirmed"
                                : "friends-page__status-badge friends-page__status-badge--pending"
                            }
                          >
                            {friend.status === CONFIRMED_FRIEND_STATUS
                              ? t("friendsPage.statusConfirmed")
                              : t("friendsPage.statusPending")}
                          </span>
                          {friend.status !== CONFIRMED_FRIEND_STATUS && (
                            <span className="friends-page__friend-status-text">
                              {friend.isIncoming
                                ? t("friendsPage.pendingIncoming")
                                : t("friendsPage.pendingOutgoing")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="friends-page__friend-actions">
                      {friend.status !== CONFIRMED_FRIEND_STATUS &&
                        friend.isIncoming && (
                          <Button
                            type="button"
                            variant="primary"
                            size="md"
                            loading={activeFriendId === friend.id}
                            disabled={activeFriendId !== null}
                            onClick={handleConfirmFriendClick(friend.id)}
                          >
                            {t("friendsPage.confirm")}
                          </Button>
                        )}

                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        loading={activeFriendId === friend.id}
                        disabled={activeFriendId !== null}
                        onClick={handleRemoveFriendClick(friend.id)}
                      >
                        {t("friendsPage.remove")}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FriendsPage;
