import { useParams } from "react-router-dom";
import { Tabs } from "antd";
import PageHeader from "../../components/common/PageHeader";
import ReportOverview from "../../components/report/ReportOverview";
import ReportSettings from "../../components/report/ReportSettings";
import ReportHistory from "../../components/report/ReportHistory";
import ReportSubmission from "../../components/report/ReportSubmission";

const ReportDetails = () => {
    const { reportId } = useParams<{ reportId: string }>();

    if (!reportId) {
        return null;
    }

    const items = [
        {
            key: "overview",
            label: "Overview",
            children: <ReportOverview reportId={reportId} />,
        },
        {
            key: "submission",
            label: "Submission",
            children: <ReportSubmission reportId={reportId} />,
        },
        {
            key: "settings",
            label: "Settings",
            children: <ReportSettings reportId={reportId} />,
        },
        {
            key: "history",
            label: "History",
            children: <ReportHistory reportId={reportId} />,
        },
    ];

    return (
        <div className="min-h-screen">
            <PageHeader
                title="Report Details"
                breadcrumbs={[
                    { label: "Reports" },
                    { label: "Report List", path: "/report/reports" },
                    { label: "Details" },
                ]}
            />

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

export default ReportDetails;
