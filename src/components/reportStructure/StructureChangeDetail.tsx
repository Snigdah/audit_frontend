import { useEffect, useState } from "react";
import { Card, Tag, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BankOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { ReportSubmissionDetailResponse } from "../../types/reportSubmission";
import StructureChangeSubmissionActions from "../reportSubmission/StructureChangeSubmissionActions";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import StructureChangeSpreadsheet from "./StructureChangeSpreadsheet";
import dayjs from "dayjs";

interface StructureChangeDetailProps {
  reportId: number;
  submissionId: number;
}

const StructureChangeDetail = ({
  reportId,
  submissionId,
}: StructureChangeDetailProps) => {
  const [submission, setSubmission] =
    useState<ReportSubmissionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSubmissionDetail = async () => {
    try {
      setLoading(true);
      const data = await ReportSubmissionService.getSubmissionDetail(submissionId);
      if (!data) {
        setError("Structure change request not found");
        return;
      }
      setSubmission(data);
      setError(null);
    } catch (err) {
      setError("Failed to load structure change request details");
      console.error("Error fetching structure change detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionDetail();
  }, [submissionId]);

  const renderStatusBadge = (status: string) => {
    const configs: Record<
      string,
      { icon: React.ReactNode; className: string; label: string }
    > = {
      APPROVED: {
        icon: <CheckCircleOutlined className="text-sm" />,
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200",
        label: "Approved",
      },
      REJECTED: {
        icon: <CloseCircleOutlined className="text-sm" />,
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
        label: "Rejected",
      },
      PENDING: {
        icon: <ClockCircleOutlined className="text-sm" />,
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
        label: "Pending",
      },
      NO_APPROVAL: {
        icon: <MinusCircleOutlined className="text-sm" />,
        className:
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200",
        label: "No approval",
      },
    };
    const c = configs[status] ?? {
      icon: <ClockCircleOutlined className="text-sm" />,
      className:
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200",
      label: String(status),
    };
    return (
      <span className={c.className}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  const getReviewStyles = (status: string) => {
    switch (status) {
      case "REJECTED":
        return {
          border: "border-rose-200",
          bg: "bg-rose-50",
          text: "text-rose-600",
          label: "Rejection Reason",
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
        <Spin size="large" tip="Loading structure change request details..." />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <Alert
        message="Error"
        description={error || "Structure change request not found"}
        type="error"
        showIcon
      />
    );
  }

  const isLateSubmission = (submission.lateMinutes ?? 0) > 0;

  return (
    <div className="space-y-6 pb-6">
      <Card className="shadow-sm">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Structure Change Request #{submission.submissionId}
                </h2>
                {isLateSubmission && (
                  <Tag color="orange" className="text-xs">
                    Late by {submission.lateMinutes} min
                  </Tag>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ClockCircleOutlined />
                <span>
                  Submitted on {dayjs(submission.submittedAt).format("MMM DD, YYYY hh:mm A")}
                </span>
              </div>
            </div>
            {renderStatusBadge(submission.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/infrastructure/department/${submission.departmentId}`)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <BankOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {submission.departmentName}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/infrastructure/equipment/${submission.equipmentId}`)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <ToolOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Equipment</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {submission.equipmentName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <ClockCircleOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {submission.creatorName}
                </p>
              </div>
            </div>
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

      {submission.data && (
        <Card
          title="Structure Data"
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
          <StructureChangeSpreadsheet
            data={submission.data.data}
            permissions={submission.data.permissions}
            mergeCells={submission.data.mergeCells}
          />
        </Card>
      )}

      <StructureChangeSubmissionActions
        reportId={reportId}
        submissionId={submission.submissionId}
        status={submission.status}
        onActionComplete={fetchSubmissionDetail}
      />
    </div>
  );
};

export default StructureChangeDetail;
