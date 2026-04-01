import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "fundbrdet-ui";

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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("landing.selectLanguage")}
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-md text-xl hover:bg-white/10 transition-colors duration-150 cursor-pointer border-none bg-transparent"
      >
        {current.flag}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-surface rounded-lg shadow-outdoor-md border border-edge overflow-hidden z-20 min-w-32.5">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => {
                i18n.changeLanguage(lang.value);
                setOpen(false);
              }}
              className={[
                "flex items-center gap-2 w-full px-3 py-2 text-sm text-left border-none cursor-pointer transition-colors duration-100",
                i18n.language === lang.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "bg-transparent text-ink hover:bg-black/5",
              ].join(" ")}
            >
              <span className="text-base">{lang.flag}</span>
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
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-8 py-3 bg-ink shadow-md">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <span className="text-2xl">🪙</span>
          <span className="text-xl font-bold text-ink-inverse tracking-tight">
            Hobbybordet
          </span>
        </Link>
        <div className="flex items-center gap-3">
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

      {/* Main info */}
      <main className="flex-1 flex flex-col items-center justify-center text-center py-16 px-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-4">
          {t("landing.title", "Welcome to Hobbybordet")}
        </h1>
        <p className="text-base lg:text-lg text-ink-muted leading-relaxed max-w-lg">
          {/* informational content about the site will be added here later */}
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
