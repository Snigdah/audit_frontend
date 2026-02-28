import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import ReportSubmissionDetail from "../../components/reportSubmission/ReportSubmissionDetail";

const ReportSubmissionHistoryDetailsPage = () => {
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
        title="History Details"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Report List", path: "/report/reports" },
          { label: "Details", path: `/report/reports/${reportId}` },
          { label: "Submission History", path: `/report/reports/${reportId}` },
          { label: "History Details" },
        ]}
      />
      <div className="px-4 bg-white rounded-lg shadow-sm">
        <ReportSubmissionDetail
          reportId={Number(reportId)}
          submissionId={Number(submissionId)}
          readOnly
        />
      </div>
    </div>
  );
};

export default ReportSubmissionHistoryDetailsPage;
