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
            tabBarGutter={32}
            className="
              [&_.ant-tabs-nav]:mb-0
              [&_.ant-tabs-nav]:border-b
              [&_.ant-tabs-nav]:border-gray-200

              [&_.ant-tabs-tab]:px-1
              [&_.ant-tabs-tab]:py-3
              [&_.ant-tabs-tab]:text-sm
              [&_.ant-tabs-tab]:font-medium
              [&_.ant-tabs-tab]:text-gray-500

              [&_.ant-tabs-tab:hover_.ant-tabs-tab-btn]:text-gray-800

              [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:text-gray-800
              [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-semibold

              [&_.ant-tabs-ink-bar]:bg-gray-800
              [&_.ant-tabs-ink-bar]:h-[3px]
              [&_.ant-tabs-ink-bar]:rounded-full
            "
          />
        </div>
      </div>
    </div>
  );
};

export default TemplatRequestDetails;
