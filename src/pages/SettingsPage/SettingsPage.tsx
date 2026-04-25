import { useEffect, useState, type FormEvent } from "react";
import { Breadcrumb, Button, ProgressSpinner, TextInput } from "fundbrdet-ui";
import { useTranslation } from "react-i18next";
import {
  getCurrentUserProfile,
  upsertCurrentUserProfile,
} from "../../hooks/useUserProfile";
import { routes } from "../../lib/routes";
import "./SettingsPage.css";

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUserProfile();

        if (!mounted) {
          return;
        }

        setEmail(data.email);
        setFirstName(data.profile.firstName);
        setLastName(data.profile.lastName);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : t("settingsPage.errors.load"),
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [t]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const savedProfile = await upsertCurrentUserProfile({
        firstName,
        lastName,
      });

      setFirstName(savedProfile.firstName);
      setLastName(savedProfile.lastName);
      setSuccess(t("settingsPage.success"));
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : t("settingsPage.errors.save"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(event.target.value);
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(event.target.value);

  return (
    <div className="settings-page">
      <Breadcrumb
        className="page-breadcrumb"
        items={[
          { label: t("breadcrumb.home"), href: routes.home },
          { label: t("breadcrumb.settings"), current: true },
        ]}
      />

      <main className="settings-page__main">
        <section className="settings-page__panel">
          <p className="settings-page__eyebrow">{t("settingsPage.eyebrow")}</p>
          <h1 className="settings-page__title">{t("settingsPage.title")}</h1>
          <p className="settings-page__description">
            {t("settingsPage.description")}
          </p>

          {loading ? (
            <div className="settings-page__loading">
              <ProgressSpinner
                size="lg"
                tone="forest"
                label={t("settingsPage.loading")}
                showLabel
              />
            </div>
          ) : (
            <form
              className="settings-page__form"
              onSubmit={handleSubmit}
              noValidate
            >
              {error && (
                <div role="alert" className="settings-page__error">
                  {error}
                </div>
              )}

              {success && (
                <div className="settings-page__success">{success}</div>
              )}

              <div className="settings-page__fields">
                <TextInput
                  label={t("settingsPage.email")}
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  size="md"
                />
                <TextInput
                  label={t("settingsPage.firstName")}
                  value={firstName}
                  onChange={handleFirstNameChange}
                  autoComplete="given-name"
                  size="md"
                  disabled={saving}
                />
                <TextInput
                  label={t("settingsPage.lastName")}
                  value={lastName}
                  onChange={handleLastNameChange}
                  autoComplete="family-name"
                  size="md"
                  disabled={saving}
                />
              </div>

              <div className="settings-page__actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                >
                  {t("settingsPage.save")}
                </Button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;
