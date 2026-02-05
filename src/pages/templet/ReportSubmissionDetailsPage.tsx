import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ReportSubmissionDetail from "../../components/reportSubmission/ReportSubmissionDetail";

const ReportSubmissionDetailsPage = () => {
  const { reportId, expectedSubmissionId, submissionId } = useParams<{
    reportId: string;
    expectedSubmissionId: string;
    submissionId: string;
  }>();

  if (!reportId || !expectedSubmissionId || !submissionId) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Submission Details"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Report List", path: "/report/reports" },
          { label: "Details", path: `/report/reports/${reportId}` },
          { label: "Submissions", path: `/report/reports/${reportId}/submissions/${expectedSubmissionId}` },
          { label: "Submission Details" },
        ]}
      />
      <div className="px-4 bg-white rounded-lg shadow-sm">
        <ReportSubmissionDetail reportId={Number(reportId)} submissionId={Number(submissionId)} />
      </div>
    </div>
  );
};

export default ReportSubmissionDetailsPage;
