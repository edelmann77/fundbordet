import { useTranslation } from "react-i18next";

export default function CreateFindingPage() {
  const { t } = useTranslation();
  return (
    <p className="text-ink-muted">{t("createFindingPage.comingSoon")}</p>
  );
}
