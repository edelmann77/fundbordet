import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Button, Card, TextInput } from "fundbrdet-ui";
import { supabase } from "../../lib/supabase";
import { routes } from "../../lib/routes";
import LanguageMenu from "../../components/LanguageMenu/LanguageMenu";
import "./SignUpPage.css";

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError(t("signup.errors.fillAll"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("signup.errors.passwordMismatch"));
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setConfirmPassword(e.target.value);

  if (success) {
    return (
      <div className="signup-page signup-page--success">
        <div className="signup-page__success">
          <div className="signup-page__header-top signup-page__header-top--success">
            <div className="signup-page__header-spacer" />
            <LanguageMenu />
          </div>
          <div className="signup-page__logo">🪙</div>
          <h1 className="signup-page__success-title">
            {t("signup.success.title")}
          </h1>
          <p className="signup-page__success-message">
            {t("signup.success.message", { email })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <Breadcrumb
        className="page-breadcrumb"
        items={[
          { label: t("breadcrumb.home"), href: routes.landing },
          { label: t("breadcrumb.signup"), current: true },
        ]}
      />
      <div className="signup-page__container">
        <div className="signup-page__header">
          <div className="signup-page__header-top">
            <div className="signup-page__header-spacer" />
            <LanguageMenu />
          </div>
          <Link to={routes.landing} className="signup-page__logo-link">
            <div className="signup-page__logo">🪙</div>
          </Link>
          <h1 className="signup-page__title">Hobbybordet</h1>
          <p className="signup-page__subtitle">{t("signup.subtitle")}</p>
        </div>

        <Card variant="elevated">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="signup-page__form"
          >
            {error && (
              <div role="alert" className="signup-page__error">
                {error}
              </div>
            )}

            <TextInput
              label={t("signup.email")}
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              size="md"
            />

            <TextInput
              label={t("signup.password")}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
              size="md"
            />

            <TextInput
              label={t("signup.confirmPassword")}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              autoComplete="new-password"
              size="md"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {t("signup.submit")}
            </Button>
          </form>
        </Card>

        <p className="signup-page__footer">
          {t("signup.haveAccount")}{" "}
          <Link to={routes.landing} className="signup-page__back-link">
            {t("signup.backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
