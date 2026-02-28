import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Empty, message, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import type {
  ReportSubmissionSimpleResponse,
  SubmissionStatus,
} from "../../types/reportSubmission";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { RangePicker } = DatePicker;
const DATE_FORMAT = "YYYY-MM-DD";

interface StructureChangeListProps {
  reportId: string;
  onOpenChangeRequest?: () => void;
}

const StructureChangeList = ({ reportId, onOpenChangeRequest }: StructureChangeListProps) => {
  const navigate = useNavigate();
  const [list, setList] = useState<ReportSubmissionSimpleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const fetchList = useCallback(
    async (
      page: number = 1,
      size: number = 10,
      opts?: { startDate?: string; endDate?: string }
    ) => {
      setLoading(true);
      try {
        const res = await ReportSubmissionService.fetchStructureChangeSubmissions(
          Number(reportId),
          {
            page: page - 1,
            size,
            ...(opts?.startDate && { startDate: opts.startDate }),
            ...(opts?.endDate && { endDate: opts.endDate }),
          }
        );
        setList(res.content ?? []);
        setTotalElements(res.pagination?.totalElements ?? 0);
      } catch (err) {
        console.error(err);
        message.error("Failed to load structure change submissions");
        setList([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    },
    [reportId]
  );

  const applyFilters = useCallback(
    (page: number = 1, size: number = pageSize) => {
      const startDate = dateRange?.[0]?.format(DATE_FORMAT);
      const endDate = dateRange?.[1]?.format(DATE_FORMAT);
      fetchList(page, size, { startDate, endDate });
    },
    [dateRange, pageSize, fetchList]
  );

  useEffect(() => {
    applyFilters(currentPage, pageSize);
  }, [currentPage, pageSize, dateRange, applyFilters]);

  useEffect(() => {
    const onRefresh = () => applyFilters(currentPage, pageSize);
    window.addEventListener("structure-change-list-refresh", onRefresh);
    return () => window.removeEventListener("structure-change-list-refresh", onRefresh);
  }, [applyFilters, currentPage, pageSize]);

  const handleRangeChange: RangePickerProps["onChange"] = (dates) => {
    setDateRange(dates ?? null);
    setCurrentPage(1);
  };

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    const nextPage = pagination.current ?? currentPage;
    const nextSize = pagination.pageSize ?? pageSize;
    setCurrentPage(nextPage);
    setPageSize(nextSize);
    applyFilters(nextPage, nextSize);
  };

  const renderStatusBadge = (status: SubmissionStatus) => {
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
      <span className={`${c.className} whitespace-nowrap`}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  const columns: ColumnsType<ReportSubmissionSimpleResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <CalendarOutlined className="text-orange-500" />
          Date
        </div>
      ),
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 200,
      render: (date: string) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {dayjs(date).format("MMM DD, YYYY")}
          </span>
          <span className="text-xs text-gray-500">
            {dayjs(date).format("hh:mm A")} • {dayjs(date).fromNow()}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: SubmissionStatus) => renderStatusBadge(status),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <UserOutlined className="text-indigo-500" />
          Reviewer
        </div>
      ),
      dataIndex: "reviewerName",
      key: "reviewerName",
      width: 140,
      render: (name: string | null) => (
        <span className="text-sm text-gray-700">
          {name ?? <span className="text-gray-400 italic">—</span>}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <span className="w-2 h-2 bg-teal-500 rounded-full" />
          Submitted By
        </div>
      ),
      dataIndex: "creatorName",
      key: "creatorName",
      width: 140,
      render: (name: string) => (
        <span className="text-sm font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          Comment
        </div>
      ),
      dataIndex: "reviewComment",
      key: "reviewComment",
      render: (comment: string | null) => (
        <div className="text-sm text-gray-600 max-w-[200px] sm:max-w-xs">
          {comment ? (
            <span className="line-clamp-2">{comment}</span>
          ) : (
            <span className="text-gray-400 italic">No comment</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div >
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Structure change requests"
          rightContent={
            <div className="flex flex-wrap lg:flex-nowrap gap-2 w-full">
              <RangePicker
                value={dateRange ?? undefined}
                onChange={handleRangeChange}
                format={DATE_FORMAT}
                className="w-full sm:w-auto min-w-0"
                placeholder={["Start date", "End date"]}
                size="middle"
              />
              {onOpenChangeRequest && (
                <CustomButton
                  onClick={onOpenChangeRequest}
                  icon={<EditOutlined />}
                  className="bg-gray-800 hover:bg-gray-700 border-none text-white whitespace-nowrap"
                >
                  Change Request
                </CustomButton>
              )}
            </div>
          }
        />
        <Table
          dataSource={list}
          columns={columns}
          rowKey="submissionId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalElements,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} requests`,
          }}
          scroll={{ x: 600 }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => {
              navigate(
                `/report/reports/${reportId}/structure-change/${record.submissionId}`
              );
            },
            className: "cursor-pointer",
          })}
          bordered
          size="middle"
          className="shadow-sm"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No structure change requests yet"
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default StructureChangeList;
