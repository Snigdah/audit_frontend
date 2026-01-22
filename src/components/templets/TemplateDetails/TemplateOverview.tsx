import { useEffect, useState } from "react";
import { Card, Tag, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { BankOutlined, ToolOutlined } from "@ant-design/icons";
import type { TemplateDetailResponse } from "../../../types/template";
import TemplateActions from "./TemplateActions";
import { TemplateService } from "../../../services/TempletService";
import TemplateSpreadsheet from "../TemplateSpreadsheet";

interface TemplateOverviewProps {
  templateRequestId: string;
}

const TemplateOverview = ({ templateRequestId }: TemplateOverviewProps) => {
  const [templateData, setTemplateData] = useState<TemplateDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
            <Tag color={getStatusColor(templateData.status)} className="text-sm px-3 py-1">
              {templateData.status}
            </Tag>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>
  );
};

export default TemplateOverview;