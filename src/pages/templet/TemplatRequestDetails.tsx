import { useParams } from "react-router-dom";
import { Tabs, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PageHeader from "../../components/common/PageHeader";
import SectionHeader from "../../components/common/SectionHeader";
import TemplateOverview from "../../components/templets/TemplateDetails/TemplateOverview";
import TemplateHistory from "../../components/templets/TemplateDetails/TemplateHistory";

const TemplatRequestDetails = () => {
  const { templateRequestId } = useParams<{ templateRequestId: string }>();

  if (!templateRequestId) {
    return null;
  }

  const items = [
    {
      key: "overview",
      label: "Overview",
      children: <TemplateOverview templateRequestId={templateRequestId} />,
    },
    {
      key: "history",
      label: "History",
      children: <TemplateHistory templateRequestId={templateRequestId} />,
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Template Request"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Template Request", path: "/reports/template" },
          { label: "Details" },
        ]}
      />

      {/* EXACT SAME WRAPPER STYLE */}
      <div className="px-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col space-y-6">
          <Tabs
            defaultActiveKey="overview"
            items={items}
            destroyOnHidden
          />
        </div>
      </div>
    </div>
  );
};

export default TemplatRequestDetails;
