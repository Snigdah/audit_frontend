import PageHeader from "../../components/common/PageHeader";
import TempletRequestList from "../../components/templets/TempletList";
import TempletList from "../../components/templets/TempletList";

const TemplateRequestPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Template Request"
        breadcrumbs={[{ label: "Reports" }, { label: "Templet Request" }]}
      />

      <TempletRequestList />
    </div>
  );
};

export default TemplateRequestPage;