import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "fundbrdet-ui";
import "./LandingPage.css";

type Language = "da" | "en";

const languages: { value: Language; flag: string; label: string }[] = [
  { value: "da", flag: "🇩🇰", label: "Dansk" },
  { value: "en", flag: "🇬🇧", label: "English" },
];

const LanguageMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current =
    languages.find((l) => l.value === i18n.language) ?? languages[0];

  return (
    <div ref={ref} className="language-menu">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("landing.selectLanguage")}
        aria-expanded={open}
        className="language-menu__trigger"
      >
        {current.flag}
      </button>

      {open && (
        <div className="language-menu__dropdown">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => {
                i18n.changeLanguage(lang.value);
                setOpen(false);
              }}
              className={[
                "language-menu__option",
                i18n.language === lang.value
                  ? "language-menu__option--active"
                  : "language-menu__option--inactive",
              ].join(" ")}
            >
              <span className="language-menu__flag">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <nav className="landing-page__nav">
        <Link to="/" className="landing-page__logo-link">
          <span className="landing-page__logo-icon">🪙</span>
          <span className="landing-page__logo-text">Hobbybordet</span>
        </Link>
        <div className="landing-page__nav-actions">
          <LanguageMenu />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary" size="sm">
              {t("nav.signup")}
            </Button>
          </Link>
        </div>
      </nav>

      <main className="landing-page__main">
        <h1 className="landing-page__title">
          {t("landing.title", "Welcome to Hobbybordet")}
        </h1>
        <p className="landing-page__info">
          {t(
            "landing.info",
            "This page will provide information about the site. Text will be added later.",
          )}
        </p>
      </main>
    </div>
  );
};

export default LandingPage;
