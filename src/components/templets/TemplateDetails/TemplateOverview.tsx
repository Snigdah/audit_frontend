import { useEffect, useState } from "react";
import { Card, Tag, Spin, Alert, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  BankOutlined,
  ToolOutlined,
  RedoOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { TemplateDetailResponse } from "../../../types/template";
import TemplateActions from "./TemplateActions";
import { TemplateService } from "../../../services/TempletService";
import TemplateSpreadsheet from "../TemplateSpreadsheet";
import { useAuth } from "../../../context/AuthContext";
import ResubmitTemplateModal from "./ResubmitTemplateModal";

interface TemplateOverviewProps {
  templateRequestId: string;
}

const TemplateOverview = ({ templateRequestId }: TemplateOverviewProps) => {
  const [templateData, setTemplateData] = useState<TemplateDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const navigate = useNavigate();
  const { authState } = useAuth();

  const fetchTemplateDetails = async () => {
    try {
      setLoading(true);
      const response = await TemplateService.fetchTemplateDetails(
        Number(templateRequestId)
      );
      setTemplateData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load template details");
      console.error("Error fetching template details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateDetails();
  }, [templateRequestId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading template details..." />
      </div>
    );
  }

  if (error || !templateData) {
    return (
      <Alert
        message="Error"
        description={error || "Template not found"}
        type="error"
        showIcon
      />
    );
  }

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


  const handleActionComplete = () => {
    // Refetch template details after approve/reject action
    fetchTemplateDetails();
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Template Information Card */}
      <Card className="shadow-sm">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {templateData.templateName}
              </h2>
              {templateData.description && (
                <p className="text-sm text-gray-600">{templateData.description}</p>
              )}
            </div>
            {renderStatusBadge(templateData.status)}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Department */}
            <div 
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/infrastructure/department/${templateData.departmentId}`)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <BankOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {templateData.departmentName || "N/A"}
                </p>
              </div>
            </div>

            {/* Equipment */}
            <div 
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/infrastructure/equipment/${templateData.equipmentId}`)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <ToolOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Equipment</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {templateData.equipmentName || "N/A"}
                </p>
              </div>
            </div>

            {/* Supervisor */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => navigate(`/infrastructure/supervisor/${templateData.supervisorId}`)}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                <UserOutlined className="text-lg text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Supervisor</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {templateData.supervisorName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {templateData.reviewComment && (
            <div
              className={`mt-4 p-4 rounded-lg border-l-4 
                ${getReviewStyles(templateData.status).border}
                ${getReviewStyles(templateData.status).bg}`}
            >
              <p className={`text-xs font-medium mb-1 ${getReviewStyles(templateData.status).text}`}>
                {getReviewStyles(templateData.status).label}
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {templateData.reviewComment}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Template Spreadsheet */}
      {templateData.latestSubmission && (
        <Card 
          title="Template Structure" 
          size="small"
          extra={
            <div className="flex items-center gap-3">
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
              {/* Resubmit Button - Only show if status is REJECTED and role is SUPERVISOR */}
              {templateData.status === "REJECTED" && authState.role === "SUPERVISOR" && (
                <Button
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={() => setIsResubmitModalOpen(true)}
                  className="ml-2 rounded-md font-medium shadow-sm transition-all !bg-gray-800 hover:!bg-gray-700 !text-white !border-0"
                >
                  Resubmit
                </Button>
              )}
            </div>
          }
        >
          <TemplateSpreadsheet
            data={templateData.latestSubmission.data}
            permissions={templateData.latestSubmission.permissions}
            mergeCells={templateData.latestSubmission.mergeCells}
          />
        </Card>
      )}

      {/* Admin Actions Component */}
      <TemplateActions
        templateId={Number(templateRequestId)}
        status={templateData.status}
        submissionId={templateData.latestSubmissionId}
        onActionComplete={handleActionComplete}
      />

      {/* Resubmit Modal */}
      {isResubmitModalOpen && templateData.latestSubmission && (
        <ResubmitTemplateModal
          templateId={Number(templateRequestId)}
          initialStructure={templateData.latestSubmission}
          templateName={templateData.templateName}
          description={templateData.description}
          departmentName={templateData.departmentName}
          equipmentName={templateData.equipmentName}
          open={isResubmitModalOpen}
          onClose={() => setIsResubmitModalOpen(false)}
          onSuccess={() => {
            setIsResubmitModalOpen(false);
            fetchTemplateDetails();
          }}
        />
      )}
    </div>
  );
};

export default TemplateOverview;