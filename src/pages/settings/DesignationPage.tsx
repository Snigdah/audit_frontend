import PageHeader from "../../components/common/PageHeader";
import Designation from "../../components/settings/Designation";

const DesignationPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Designation"
        breadcrumbs={[{ label: "Settings" }, { label: "Designation" }]}
      />
      <Designation />
    </div>
  );
};

export default DesignationPage;
