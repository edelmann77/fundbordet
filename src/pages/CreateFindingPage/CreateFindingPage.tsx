import { useTranslation } from "react-i18next";
import "./CreateFindingPage.css";

export const CreateFindingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <p className="create-finding-page__coming-soon">
      {t("createFindingPage.comingSoon")}
    </p>
  );
};

export default CreateFindingPage;
