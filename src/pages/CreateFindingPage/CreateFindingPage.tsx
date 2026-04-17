import { useTranslation } from "react-i18next";
import { Breadcrumb } from "fundbrdet-ui";
import { routes } from "../../lib/routes";
import "./CreateFindingPage.css";

export const CreateFindingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Breadcrumb
        className="page-breadcrumb"
        items={[
          { label: t("breadcrumb.home"), href: routes.home },
          { label: t("breadcrumb.createFinding"), current: true },
        ]}
      />
      <p className="create-finding-page__coming-soon">
        {t("createFindingPage.comingSoon")}
      </p>
    </>
  );
};

export default CreateFindingPage;
