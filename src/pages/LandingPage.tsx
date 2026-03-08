import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "fundbrdet-ui";

type Language = "da" | "en";

const languages: { value: Language; flag: string; label: string }[] = [
  { value: "da", flag: "🇩🇰", label: "Dansk" },
  { value: "en", flag: "🇬🇧", label: "English" },
];

function LanguageMenu() {
  const { i18n } = useTranslation();
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
        aria-label="Select language"
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
}

export default function LandingPage() {
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
          <Link to="/signup">
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

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-16 px-8 bg-linear-to-br from-page to-surface">
        <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-2">
          {t("hero.eyebrow")}
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-ink leading-tight max-w-xl mb-3">
          {t("hero.headline")}
        </h1>
        <p className="text-base lg:text-lg text-ink-muted leading-relaxed max-w-lg mb-6">
          {t("hero.description")}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/signup">
            <Button variant="primary" size="lg">
              {t("hero.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Finding types */}
      <section className="bg-primary-dark py-6 lg:py-10 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-ink-inverse mb-1">
            {t("findingTypes.heading")}
          </h2>
          <p className="text-sm text-ink-inverse/70 leading-relaxed">
            {t("findingTypes.subtext")}
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mt-5">
            <Card variant="default" padding="p-5">
              <div className="mb-2">
                <svg
                  viewBox="0 0 24 24"
                  width="1.875rem"
                  height="1.875rem"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                  aria-hidden="true"
                >
                  {/* Search coil */}
                  <ellipse cx="4.5" cy="20" rx="3.5" ry="2" />
                  {/* Lower arm */}
                  <line x1="4.5" y1="18" x2="8" y2="14.5" />
                  {/* Main shaft */}
                  <line x1="8" y1="14.5" x2="18" y2="4.5" />
                  {/* Handle grip */}
                  <line x1="15.5" y1="4" x2="21" y2="4" />
                  <line x1="21" y1="4" x2="21" y2="7" />
                  {/* Control box */}
                  <rect x="10" y="9" width="4" height="2.5" rx="0.5" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-ink mb-1">
                {t("findingTypes.metalDetecting.title")}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {t("findingTypes.metalDetecting.description")}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
