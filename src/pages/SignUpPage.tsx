import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, TextInput } from "fundbrdet-ui";
import { supabase } from "../lib/supabase";

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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-page">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6 text-3xl">
            🪙
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">
            {t("signup.success.title")}
          </h1>
          <p className="text-base text-ink-muted leading-relaxed">
            {t("signup.success.message", { email })}
          </p>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-ink-muted">{t("signup.subtitle")}</p>
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
              label={t("signup.email")}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              size="md"
            />

            <TextInput
              label={t("signup.password")}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              size="md"
            />

            <TextInput
              label={t("signup.confirmPassword")}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        <p className="text-center text-sm text-ink-muted mt-6">
          {t("signup.haveAccount")}{" "}
          <Link
            to="/"
            className="text-primary font-semibold no-underline hover:text-primary-dark hover:underline transition-colors"
          >
            {t("signup.backHome")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
