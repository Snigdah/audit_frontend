import { useNavigate } from "react-router-dom";
import { BankOutlined, ToolOutlined, LinkOutlined } from "@ant-design/icons";
import type { ReportDetailResponse } from "../../types/report";

interface ReportOverviewDetailsProps {
  report: ReportDetailResponse;
}

const ReportOverviewDetails = ({ report }: ReportOverviewDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      {/* Header strip - report identity */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
            {report.reportName}
          </h2>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Version {report.reportVersionId}
          </span>
        </div>
        {report.description != null && report.description !== "" && (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {report.description}
          </p>
        )}
      </div>

      {/* Related resources - linkable */}
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Department
            </span>
            <button
              type="button"
              onClick={() =>
                navigate(`/infrastructure/department/${report.departmentId}`)
              }
              className="text-sm font-medium text-gray-600 hover:text-gray-700 hover:underline underline-offset-2 text-left flex items-center gap-1.5 transition-colors w-fit cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-1 rounded"
            >
              <BankOutlined className="text-slate-400 flex-shrink-0 text-xs" />
              <span className="truncate">{report.departmentName}</span>
              <LinkOutlined className="text-[10px] opacity-70 flex-shrink-0" />
            </button>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Equipment
            </span>
            <button
              type="button"
              onClick={() =>
                navigate(`/infrastructure/equipment/${report.equipmentId}`)
              }
              className="text-sm font-medium text-gray-600 hover:text-gray-700 hover:underline underline-offset-2 text-left flex items-center gap-1.5 transition-colors w-fit cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-1 rounded"
            >
              <ToolOutlined className="text-slate-400 flex-shrink-0 text-xs" />
              <span className="truncate">{report.equipmentName}</span>
              <LinkOutlined className="text-[10px] opacity-70 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportOverviewDetails;
