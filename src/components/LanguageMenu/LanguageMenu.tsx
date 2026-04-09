import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageMenu.css";

type Language = "da" | "en";

const languages: { value: Language; flag: string; label: string }[] = [
  { value: "da", flag: "🇩🇰", label: "Dansk" },
  { value: "en", flag: "🇬🇧", label: "English" },
];

export const LanguageMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const currentLanguage =
    languages.find((language) => language.value === i18n.language) ??
    languages[0];

  return (
    <div ref={ref} className="language-menu">
      <button
        type="button"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        aria-label={t("landing.selectLanguage")}
        aria-expanded={open}
        className="language-menu__trigger"
      >
        {currentLanguage.flag}
      </button>

      {open && (
        <div className="language-menu__dropdown">
          {languages.map((language) => (
            <button
              key={language.value}
              type="button"
              onClick={() => {
                i18n.changeLanguage(language.value);
                setOpen(false);
              }}
              className={[
                "language-menu__option",
                i18n.language === language.value
                  ? "language-menu__option--active"
                  : "language-menu__option--inactive",
              ].join(" ")}
            >
              <span className="language-menu__flag">{language.flag}</span>
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageMenu;
