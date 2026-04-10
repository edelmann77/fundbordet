import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  listPendingFriendRequests,
  type AppNotification,
} from "../../hooks/useFriendSearch";
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const loadNotificationsRef = useRef<() => Promise<void>>(async () => {});

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const nextNotifications = await listPendingFriendRequests();
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
      void loadNotificationsRef.current();
    }
  };

  const handleOpenFriends = () => {
    setOpen(false);
    navigate("/detector/friends");
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
        {notifications.length > 0 && (
          <span className="notifications-menu__badge" aria-hidden="true">
            {notifications.length}
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
                    onClick={handleOpenFriends}
                    role="menuitem"
                  >
                    <span className="notifications-menu__item-title">
                      {t("notifications.friendRequestTitle")}
                    </span>
                    <span className="notifications-menu__item-description">
                      {t("notifications.friendRequestDescription", {
                        email: notification.senderEmail,
                      })}
                    </span>
                    <span className="notifications-menu__item-action">
                      {t("notifications.viewFriends")}
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
