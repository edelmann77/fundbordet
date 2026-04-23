import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../lib/routes";
import { supabase } from "../../lib/supabase";
import "./AccountMenu.css";

const AccountIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="account-menu__icon"
    focusable="false"
  >
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.314 0-6 2.015-6 4.5V20h12v-1.5c0-2.485-2.686-4.5-6-4.5Z"
      fill="currentColor"
    />
  </svg>
);

export const AccountMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

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

  const handleSettingsClick = () => {
    setOpen(false);
    navigate(routes.settings);
  };

  const handleFriendsClick = () => {
    setOpen(false);
    navigate(routes.friends);
  };

  const handleLogoutClick = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      navigate(routes.landing, { replace: true });
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  const handleToggle = () => setOpen((value) => !value);

  return (
    <div ref={ref} className="account-menu">
      <button
        type="button"
        className="account-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("account.openMenu")}
        onClick={handleToggle}
      >
        <AccountIcon />
      </button>

      {open && (
        <div className="account-menu__dropdown" role="menu">
          <button
            type="button"
            className="account-menu__item"
            onClick={handleFriendsClick}
            role="menuitem"
          >
            {t("account.friends")}
          </button>
          <button
            type="button"
            className="account-menu__item"
            onClick={handleSettingsClick}
            role="menuitem"
          >
            {t("account.settings")}
          </button>
          <button
            type="button"
            className="account-menu__item account-menu__item--danger"
            onClick={handleLogoutClick}
            role="menuitem"
            disabled={loggingOut}
          >
            {loggingOut ? t("account.loggingOut") : t("account.logout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
