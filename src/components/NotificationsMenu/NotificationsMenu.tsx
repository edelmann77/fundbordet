import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  listAppNotifications,
  type AppNotification,
} from "../../hooks/useFriendSearch";
import { routes } from "../../lib/routes";
import { getSessionUser } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import "./NotificationsMenu.css";

const BellIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="notifications-menu__icon"
    focusable="false"
  >
    <path
      d="M12 3.5a4.25 4.25 0 0 0-4.25 4.25v1.09c0 .95-.33 1.87-.93 2.6L5.44 13.1A1.75 1.75 0 0 0 6.79 16h10.42a1.75 1.75 0 0 0 1.35-2.9l-1.38-1.66a4.09 4.09 0 0 1-.93-2.6V7.75A4.25 4.25 0 0 0 12 3.5Zm0 17a2.73 2.73 0 0 0 2.57-1.82.75.75 0 0 0-.71-.98h-3.72a.75.75 0 0 0-.71.98A2.73 2.73 0 0 0 12 20.5Z"
      fill="currentColor"
    />
  </svg>
);

export const NotificationsMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const loadNotificationsRef = useRef<() => Promise<void>>(async () => {});

  const markNotificationsAsSeen = () => {
    const seenAt = new Date().toISOString();
    setLastSeenAt(seenAt);

    if (!currentUserId) {
      return;
    }

    localStorage.setItem(`notifications:lastSeenAt:${currentUserId}`, seenAt);
  };

  const unseenCount = notifications.filter((notification) => {
    if (!lastSeenAt) {
      return true;
    }

    return (
      new Date(notification.createdAt).getTime() >
      new Date(lastSeenAt).getTime()
    );
  }).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const nextNotifications = await listAppNotifications();
      setNotifications(nextNotifications);
      setLoadError(null);
    } catch {
      setLoadError(t("notifications.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  loadNotificationsRef.current = loadNotifications;

  useEffect(() => {
    setOpen(false);
    void loadNotifications();
  }, [location.pathname]);

  useEffect(() => {
    const onWindowFocus = () => {
      void loadNotificationsRef.current();
    };

    window.addEventListener("focus", onWindowFocus);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const setupRealtime = async () => {
      const user = await getSessionUser();

      if (cancelled || !user) {
        return;
      }

      setCurrentUserId(user.id);
      setLastSeenAt(
        localStorage.getItem(`notifications:lastSeenAt:${user.id}`),
      );

      const refreshNotifications = () => {
        void loadNotificationsRef.current();
      };

      channel = supabase
        .channel(`friend-notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "friends",
            filter: `invitee=eq.${user.id}`,
          },
          refreshNotifications,
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "friends",
            filter: `invitee=eq.${user.id}`,
          },
          refreshNotifications,
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "friends",
            filter: `invitee=eq.${user.id}`,
          },
          refreshNotifications,
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "finding_comment_mentions",
            filter: `mentioned_user_id=eq.${user.id}`,
          },
          refreshNotifications,
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "finding_comment_mentions",
            filter: `mentioned_user_id=eq.${user.id}`,
          },
          refreshNotifications,
        )
        .subscribe();
    };

    void setupRealtime();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleTriggerClick = () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      markNotificationsAsSeen();
      void loadNotificationsRef.current();
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    markNotificationsAsSeen();
  }, [notifications, open]);

  const handleOpenFriends = () => {
    setOpen(false);
    navigate(routes.friends);
  };

  const handleOpenMention = (notification: AppNotification) => {
    if (!notification.findingId) {
      return;
    }

    setOpen(false);
    navigate(
      `${routes.fundDatabase}?findingId=${encodeURIComponent(notification.findingId)}&openComments=1`,
    );
  };

  return (
    <div ref={ref} className="notifications-menu">
      <button
        type="button"
        className="notifications-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("notifications.openMenu")}
        onClick={handleTriggerClick}
      >
        <BellIcon />
        {unseenCount > 0 && (
          <span className="notifications-menu__badge" aria-hidden="true">
            {unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notifications-menu__dropdown" role="menu">
          <div className="notifications-menu__header">
            <p className="notifications-menu__title">
              {t("notifications.title")}
            </p>
            <p className="notifications-menu__meta">
              {loading
                ? t("notifications.loading")
                : t("notifications.count", { count: notifications.length })}
            </p>
          </div>

          {loadError ? (
            <p className="notifications-menu__state" role="alert">
              {loadError}
            </p>
          ) : null}

          {!loadError && loading ? (
            <p className="notifications-menu__state">
              {t("notifications.loading")}
            </p>
          ) : null}

          {!loadError && !loading && notifications.length === 0 ? (
            <div className="notifications-menu__empty-state">
              <p className="notifications-menu__empty-title">
                {t("notifications.emptyTitle")}
              </p>
              <p className="notifications-menu__empty-description">
                {t("notifications.emptyDescription")}
              </p>
            </div>
          ) : null}

          {!loadError && !loading && notifications.length > 0 ? (
            <ul className="notifications-menu__list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="notifications-menu__list-item"
                >
                  <button
                    type="button"
                    className="notifications-menu__item"
                    onClick={() => {
                      if (notification.kind === "comment-mention") {
                        handleOpenMention(notification);
                        return;
                      }

                      handleOpenFriends();
                    }}
                    role="menuitem"
                  >
                    <span className="notifications-menu__item-title">
                      {notification.kind === "comment-mention"
                        ? t("notifications.commentMentionTitle")
                        : t("notifications.friendRequestTitle")}
                    </span>
                    <span className="notifications-menu__item-description">
                      {notification.kind === "comment-mention"
                        ? t("notifications.commentMentionDescription")
                        : t("notifications.friendRequestDescription", {
                            email: notification.senderEmail,
                          })}
                    </span>
                    <span className="notifications-menu__item-action">
                      {notification.kind === "comment-mention"
                        ? t("notifications.viewComment")
                        : t("notifications.viewFriends")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
