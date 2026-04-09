import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Button } from "fundbrdet-ui";
import LanguageMenu from "../../components/LanguageMenu/LanguageMenu";
import "./LandingPage.css";

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

      <Breadcrumb
        className="page-breadcrumb"
        items={[{ label: t("breadcrumb.home"), current: true }]}
      />
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
