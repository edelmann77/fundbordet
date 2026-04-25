import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Button } from "fundbrdet-ui";
import LanguageMenu from "../../components/LanguageMenu/LanguageMenu";
import { routes } from "../../lib/routes";
import "./LandingPage.css";

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="landing-page">
      <nav className="landing-page__nav">
        <Link to={routes.landing} className="landing-page__logo-link">
          <span className="landing-page__logo-icon">🪙</span>
          <span className="landing-page__logo-text">Hobbybordet</span>
        </Link>
        <div className="landing-page__nav-actions">
          <LanguageMenu />
          <Link to={routes.login}>
            <Button variant="ghost" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
          <Link to={routes.signup}>
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
        <h1 className="landing-page__title">{t("landing.title")}</h1>
        <p className="landing-page__info">{t("landing.info")}</p>
      </main>
    </div>
  );
};

export default LandingPage;
