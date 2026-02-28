import { Card } from "antd";
import {
  FileTextOutlined,
  NumberOutlined,
  BankOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ReportDetailResponse } from "../../types/report";

interface ReportOverviewDetailsProps {
  report: ReportDetailResponse;
}

const ReportOverviewDetails = ({ report }: ReportOverviewDetailsProps) => {
  return (
    <Card className="shadow-sm" size="small">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg min-w-0">
          <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-sm flex-shrink-0">
            <FileTextOutlined className="text-base text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Report Name</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {report.reportName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg min-w-0">
          <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-sm flex-shrink-0">
            <NumberOutlined className="text-base text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Version ID</p>
            <p className="text-sm font-medium text-gray-800">
              {report.reportVersionId}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg min-w-0 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-sm flex-shrink-0">
            <BankOutlined className="text-base text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Department</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {report.departmentName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg min-w-0">
          <div className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-sm flex-shrink-0">
            <ToolOutlined className="text-base text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Equipment</p>
            <p className="text-sm font-medium text-gray-800 truncate">
              {report.equipmentName}
            </p>
          </div>
        </div>

        {(report.description != null && report.description !== "") && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg min-w-0 sm:col-span-2 lg:col-span-5">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Description</p>
              <p className="text-sm text-gray-800 leading-relaxed">
                {report.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportOverviewDetails;
