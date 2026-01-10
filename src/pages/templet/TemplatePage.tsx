import PageHeader from "../../components/common/PageHeader";
import TempletList from "../../components/templets/TempletList";

const TemplatePage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Template"
        breadcrumbs={[{ label: "Template" }]}
      />

      <TempletList />
    </div>
  );
};

export default TemplatePage;