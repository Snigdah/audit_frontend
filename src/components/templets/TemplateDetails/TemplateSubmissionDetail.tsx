import { useEffect, useState } from "react";
import { Card, Tag, Spin, Alert } from "antd";
import dayjs from "dayjs";
import { TemplateService } from "../../../services/TempletService";
import TemplateSpreadsheet from "../TemplateSpreadsheet";
import type { TemplateSubmissionDetailResponse } from "../../../types/template";

interface TemplateSubmissionDetailProps {
  templateId: number;
  submissionId: number;
}

const TemplateSubmissionDetail = ({
  templateId,
  submissionId,
}: TemplateSubmissionDetailProps) => {
  const [submission, setSubmission] =
    useState<TemplateSubmissionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      const response = await TemplateService.fetchTemplateSubmissionDetail(
        templateId,
        submissionId
      );
      setSubmission(response);
      setError(null);
    } catch (err) {
      setError("Failed to load submission details");
      console.error("Error fetching submission detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionDetail();
  }, [templateId, submissionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getReviewStyles = (status: string) => {
    switch (status) {
      case "REJECTED":
        return {
          border: "border-rose-200",
          bg: "bg-rose-50",
          text: "text-rose-600",
          label: "Rejected Reason",
        };
      case "APPROVED":
        return {
          border: "border-emerald-200",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          label: "Approval Note",
        };
      default:
        return {
          border: "border-gray-200",
          bg: "bg-gray-50",
          text: "text-gray-700",
          label: "Review Note",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading submission details..." />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <Alert
        message="Error"
        description={error || "Submission not found"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6 pb-6 pt-2">
      <Card className="shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Submission Details
              </h2>
              <p className="text-sm text-gray-600">
                Submitted on {dayjs(submission.createdAt).format("MMM DD, YYYY")}
              </p>
            </div>
            <Tag color={getStatusColor(submission.status)} className="text-sm px-3 py-1">
              {submission.status}
            </Tag>
          </div>

          {submission.reviewComments && (
            <div
              className={`mt-4 p-4 rounded-lg border-l-4 
                ${getReviewStyles(submission.status).border}
                ${getReviewStyles(submission.status).bg}`}
            >
              <p className={`text-xs font-medium mb-1 ${getReviewStyles(submission.status).text}`}>
                {getReviewStyles(submission.status).label}
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {submission.reviewComments}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Submission Structure"
        size="small"
        extra={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-white border border-gray-300 rounded"></span>
              <span className="text-gray-600">Full Access</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></span>
              <span className="text-gray-600">Restricted</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-50 border border-red-200 rounded"></span>
              <span className="text-gray-600">No Access</span>
            </span>
          </div>
        }
      >
        <TemplateSpreadsheet
          data={submission.data.data}
          permissions={submission.data.permissions}
          mergeCells={submission.data.mergeCells}
        />
      </Card>
    </div>
  );
};

export default TemplateSubmissionDetail;
