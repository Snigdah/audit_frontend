import { useState, useEffect } from "react";
import { Spin, Alert, Dropdown } from "antd";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import {
  PlusOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import SupervisorSubmissionModal from "../reportSubmission/SupervisorSubmissionModal";
import ReportOverviewDetails from "./ReportOverviewDetails";
import ReportOverviewSpreadsheet from "./ReportOverviewSpreadsheet";
import { useAuth } from "../../context/AuthContext";
import { ReportService } from "../../services/ReportService";
import type { ReportDetailResponse } from "../../types/report";
import type { MenuProps } from "antd";

interface ReportOverviewProps {
  reportId: string;
}

const ReportOverview = ({ reportId }: ReportOverviewProps) => {
  const { authState } = useAuth();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingType, setExportingType] = useState<"excel" | "pdf" | null>(
    null
  );
  const [reportDetails, setReportDetails] =
    useState<ReportDetailResponse | null>(null);

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
        setError(
          err.response?.data?.userMessage ?? "Failed to load report details"
        );
        setReportDetails(null);
      })
      .finally(() => setLoading(false));
  }, [reportId]);

  const getFileNameFromDisposition = (
    contentDisposition?: string,
    fallback?: string
  ) => {
    if (!contentDisposition) return fallback ?? "download";

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1]);
    }

    const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    if (asciiMatch?.[1]) {
      return asciiMatch[1];
    }

    return fallback ?? "download";
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleExportExcel = async () => {
    try {
      setExportingType("excel");
      const response = await ReportService.exportReportExcel(Number(reportId));
      const fileName = getFileNameFromDisposition(
        response.headers["content-disposition"],
        `report-${reportId}.xlsx`
      );
      downloadBlob(response.data, fileName);
    } catch (err) {
      console.error("Failed to export report excel:", err);
    } finally {
      setExportingType(null);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingType("pdf");
      const response = await ReportService.exportReportPdf(Number(reportId));
      const fileName = getFileNameFromDisposition(
        response.headers["content-disposition"],
        `report-${reportId}.pdf`
      );
      downloadBlob(response.data, fileName);
    } catch (err) {
      console.error("Failed to export report pdf:", err);
    } finally {
      setExportingType(null);
    }
  };

  const exportItems: MenuProps["items"] = [
    {
      key: "excel",
      label: "Export Excel",
      icon: <FileExcelOutlined />,
      disabled: exportingType !== null,
    },
    {
      key: "pdf",
      label: "Export PDF",
      icon: <FilePdfOutlined />,
      disabled: exportingType !== null,
    },
  ];

  const handleExportMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "excel") {
      void handleExportExcel();
      return;
    }
    if (key === "pdf") {
      void handleExportPDF();
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Overview"
          rightContent={
            <div className="flex gap-2">
              {/* Submission Button */}
              {canCreateSubmission && (
                <CustomButton
                  onClick={() => setSubmissionModalOpen(true)}
                  icon={<PlusOutlined />}
                  className="bg-gray-800 hover:bg-gray-700 border-none text-white whitespace-nowrap"
                >
                  Submission
                </CustomButton>
              )}

              {/* ✅ Export Button */}
              <Dropdown
                menu={{ items: exportItems, onClick: handleExportMenuClick }}
                trigger={["click"]}
              >
                <CustomButton
                  loading={exportingType !== null}
                  loadingText={
                    exportingType === "excel"
                      ? "Exporting Excel..."
                      : "Exporting PDF..."
                  }
                  icon={<DownOutlined />}
                  className="bg-white border border-gray-300 text-gray-700"
                >
                  Export
                </CustomButton>
              </Dropdown>
            </div>
          }
        />

        <div className="text-sm text-gray-600">
          {canCreateSubmission
            ? "View report structure. Use the Submission button to create a new submission."
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