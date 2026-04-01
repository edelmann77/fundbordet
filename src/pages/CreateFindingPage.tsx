import { useTranslation } from "react-i18next";

export const CreateFindingPage: React.FC = () => {
  const { t } = useTranslation();
  return <p className="text-ink-muted">{t("createFindingPage.comingSoon")}</p>;
};

export default CreateFindingPage;
