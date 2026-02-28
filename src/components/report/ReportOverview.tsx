import { useState, useEffect } from "react";
import { Spin, Alert } from "antd";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import SupervisorSubmissionModal from "../reportSubmission/SupervisorSubmissionModal";
import ReportOverviewDetails from "./ReportOverviewDetails";
import ReportOverviewSpreadsheet from "./ReportOverviewSpreadsheet";
import { useAuth } from "../../context/AuthContext";
import { ReportService } from "../../services/ReportService";
import type { ReportDetailResponse } from "../../types/report";

interface ReportOverviewProps {
  reportId: string;
}

const ReportOverview = ({ reportId }: ReportOverviewProps) => {
  const { authState } = useAuth();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<ReportDetailResponse | null>(null);

  const canCreateSubmission =
    authState.role === "ADMIN" || authState.role === "SUPERVISOR";

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    setError(null);
    ReportService.getReportDetails(Number(reportId))
      .then((response) => {
        setReportDetails(response);
      })
      .catch((err) => {
        console.error("Failed to load report details:", err);
        setError(err.response?.data?.devMessage ?? "Failed to load report details");
        setReportDetails(null);
      })
      .finally(() => setLoading(false));
  }, [reportId]);

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Overview"
          rightContent={
            canCreateSubmission ? (
              <CustomButton
                onClick={() => setSubmissionModalOpen(true)}
                icon={<PlusOutlined />}
                className="bg-gray-800 hover:bg-gray-700 border-none text-white whitespace-nowrap"
              >
                Submission
              </CustomButton>
            ) : undefined
          }
        />
        <div className="text-sm text-gray-600">
          {canCreateSubmission
            ? "View report structure. Use the Submission button to create a new submission (Admin / Supervisor can edit any cell; structure changes are not allowed)."
            : "View report structure. Table is read-only."}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" tip="Loading report details…" />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : reportDetails ? (
          <>
            <ReportOverviewDetails report={reportDetails} />
            {reportDetails.data?.data?.length ? (
              <ReportOverviewSpreadsheet
                data={reportDetails.data.data}
                permissions={reportDetails.data.permissions ?? []}
                mergeCells={reportDetails.data.mergeCells}
              />
            ) : (
              <div className="text-gray-500 text-sm py-8 text-center">
                No report structure data available.
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 text-sm py-8 text-center">
            No report details available.
          </div>
        )}
      </div>

      <SupervisorSubmissionModal
        reportId={Number(reportId)}
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        onSuccess={() => setSubmissionModalOpen(false)}
      />
    </div>
  );
};

export default ReportOverview;
