import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Card, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabase";
import "./LoginPage.css";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("login.errors.fillAll"));
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate("/detector/home");
    }
  };

  return (
    <div className="login-page">
      <Breadcrumb
        className="page-breadcrumb"
        items={[
          { label: t("breadcrumb.home"), href: "/" },
          { label: t("breadcrumb.login"), current: true },
        ]}
      />
      <div className="login-page__container">
        <div className="login-page__header">
          <Link to="/" className="login-page__logo-link">
            <div className="login-page__logo">🪙</div>
          </Link>
          <h1 className="login-page__title">Hobbybordet</h1>
          <p className="login-page__subtitle">{t("login.subtitle")}</p>
        </div>

        <Card variant="elevated">
          <form onSubmit={handleSubmit} noValidate className="login-page__form">
            {error && (
              <div role="alert" className="login-page__error">
                {error}
              </div>
            )}

            <TextInput
              label={t("login.email")}
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              size="md"
            />

            <div className="login-page__password-field">
              <TextInput
                label={t("login.password")}
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                size="md"
              />
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="login-page__forgot-link"
              >
                {t("login.forgotPassword")}
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {t("login.submit")}
            </Button>
          </form>
        </Card>

        <p className="login-page__footer">
          {t("login.noAccount")}{" "}
          <Link to="/signup" className="login-page__signup-link">
            {t("login.signupFree")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
