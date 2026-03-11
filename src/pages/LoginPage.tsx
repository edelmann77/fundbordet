import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-page">
      <div className="w-full max-w-[420px]">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block no-underline">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 text-3xl">
              🪙
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-ink leading-tight mb-1">
            Hobbybordet
          </h1>
          <p className="text-sm text-ink-muted">{t("login.subtitle")}</p>
        </div>

        <Card variant="elevated" padding="p-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {error && (
              <div
                role="alert"
                className="bg-error-soft border border-edge-error rounded-md px-4 py-3 text-sm text-error"
              >
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

            <div>
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
                className="block text-right text-sm text-primary mt-2 no-underline hover:text-primary-dark hover:underline transition-colors"
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

            {/* Divider */}
            <div className="flex items-center gap-3 text-sm text-ink-faint">
              <hr className="flex-1 border-edge" />
              {t("login.or")}
              <hr className="flex-1 border-edge" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {}}
            >
              {t("login.google")}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-ink-muted mt-6">
          {t("login.noAccount")}{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold no-underline hover:text-primary-dark hover:underline transition-colors"
          >
            {t("login.signupFree")}
          </Link>
        </p>
      </div>
    </div>
  );
}
