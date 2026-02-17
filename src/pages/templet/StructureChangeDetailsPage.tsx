import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StructureChangeDetail from "../../components/reportStructure/StructureChangeDetail";

const StructureChangeDetailsPage = () => {
  const { reportId, submissionId } = useParams<{
    reportId: string;
    submissionId: string;
  }>();

  if (!reportId || !submissionId) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Structure Change Request Details"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Report List", path: "/report/reports" },
          { label: "Details", path: `/report/reports/${reportId}` },
          { label: "Structure", path: `/report/reports/${reportId}?tab=structure` },
          { label: "Structure Change Request Details" },
        ]}
      />
      <div className="px-4 bg-white rounded-lg shadow-sm">
        <StructureChangeDetail reportId={Number(reportId)} submissionId={Number(submissionId)} />
      </div>
    </div>
  );
};

export default StructureChangeDetailsPage;
