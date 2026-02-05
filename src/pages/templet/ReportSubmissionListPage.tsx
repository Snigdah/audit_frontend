import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import PageHeader from "../../components/common/PageHeader";
import SubmissionList from "../../components/reportSubmission/SubmissionList";
import CreateSubmissionModal from "../../components/reportSubmission/CreateSubmissionModal";
import { ReportService } from "../../services/ReportService";
import type { TemplateReportResponse } from "../../types/report";

const ReportSubmissionListPage = () => {
  const { reportId, expectedSubmissionId } = useParams<{
    reportId: string;
    expectedSubmissionId: string;
  }>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reportDetails, setReportDetails] = useState<TemplateReportResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    if (reportId) {
      setLoadingReport(true);
      ReportService.fetchReportDetails(Number(reportId))
        .then((data) => setReportDetails(data))
        .catch((err) => {
          console.error("Failed to fetch report details:", err);
        })
        .finally(() => setLoadingReport(false));
    }
  }, [reportId]);

  if (!reportId || !expectedSubmissionId) {
    return null;
  }

  if (loadingReport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading report details..." />
      </div>
    );
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
        templateVersionId={reportDetails?.templateVersionId ?? 1}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default ReportSubmissionListPage;
