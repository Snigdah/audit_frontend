import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SubmissionList from "../../components/reportSubmission/SubmissionList";
import CreateSubmissionModal from "../../components/reportSubmission/CreateSubmissionModal";

const ReportSubmissionListPage = () => {
  const { reportId, expectedSubmissionId } = useParams<{
    reportId: string;
    expectedSubmissionId: string;
  }>();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (!reportId || !expectedSubmissionId) {
    return null;
  }

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    window.dispatchEvent(new CustomEvent("submission-list-refresh"));
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Slot submissions"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Report List", path: "/report/reports" },
          { label: "Details", path: `/report/reports/${reportId}` },
          { label: "Submissions" },
        ]}
      />
      <SubmissionList
        reportId={reportId}
        expectedSubmissionId={expectedSubmissionId}
        onOpenCreate={() => setCreateModalOpen(true)}
      />
      <CreateSubmissionModal
        reportId={Number(reportId)}
        expectedSubmissionId={Number(expectedSubmissionId)}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ReportSubmissionListPage;
