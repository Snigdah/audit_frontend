import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Select, DatePicker, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RangePickerProps } from "antd/es/date-picker";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import type {
  ReportSubmissionHistoryResponse,
  SubmissionStatus,
  UserRole,
} from "../../types/reportSubmission";
import dayjs, { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

const DATE_FORMAT = "YYYY-MM-DD";

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "NO_APPROVAL", label: "No approval" },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "OPERATOR", label: "Operator" },
];

const LATE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "late", label: "Late only" },
  { value: "ontime", label: "On time" },
];

interface ReportHistoryProps {
  reportId: string;
}

const ReportHistory = ({ reportId }: ReportHistoryProps) => {
  const navigate = useNavigate();
  const [list, setList] = useState<ReportSubmissionHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | undefined>();
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();
  const [lateFilter, setLateFilter] = useState<string>("all");

  const fetchHistory = useCallback(
    (
      page: number = 1,
      size: number = 10,
      opts?: {
        startDate?: string;
        endDate?: string;
        status?: SubmissionStatus;
        role?: UserRole;
        late?: boolean;
      }
    ) => {
      setLoading(true);
      const params = {
        page: page - 1,
        size,
        ...(opts?.startDate && { startDate: opts.startDate }),
        ...(opts?.endDate && { endDate: opts.endDate }),
        ...(opts?.status && { status: opts.status }),
        ...(opts?.role && { role: opts.role }),
        ...(opts?.late !== undefined && { late: opts.late }),
      };
      ReportSubmissionService.fetchSubmissionHistory(Number(reportId), params)
        .then((res) => {
          setList(res.content ?? []);
          setTotalElements(res.pagination?.totalElements ?? 0);
        })
        .catch((err) => {
          console.error(err);
          message.error("Failed to load submission history");
          setList([]);
          setTotalElements(0);
        })
        .finally(() => setLoading(false));
    },
    [reportId]
  );

  const applyFilters = useCallback(
    (page: number = 1, size: number = pageSize) => {
      const startDate = dateRange?.[0]?.format(DATE_FORMAT);
      const endDate = dateRange?.[1]?.format(DATE_FORMAT);
      fetchHistory(page, size, {
        startDate,
        endDate,
        status: statusFilter,
        role: roleFilter,
        late:
          lateFilter === "all"
            ? undefined
            : lateFilter === "late"
              ? true
              : lateFilter === "ontime"
                ? false
                : undefined,
      });
    },
    [dateRange, statusFilter, roleFilter, lateFilter, pageSize, fetchHistory]
  );

  useEffect(() => {
    applyFilters(currentPage, pageSize);
  }, [currentPage, pageSize, statusFilter, roleFilter, lateFilter]);

  const handleRangeChange: RangePickerProps["onChange"] = (dates) => {
    setDateRange(dates ?? null);
    setCurrentPage(1);
    if (dates?.[0] && dates?.[1]) {
      fetchHistory(1, pageSize, {
        startDate: dates[0].format(DATE_FORMAT),
        endDate: dates[1].format(DATE_FORMAT),
        status: statusFilter,
        role: roleFilter,
        late:
          lateFilter === "all"
            ? undefined
            : lateFilter === "late"
              ? true
              : lateFilter === "ontime"
                ? false
                : undefined,
      });
    } else {
      fetchHistory(1, pageSize, {
        status: statusFilter,
        role: roleFilter,
        late:
          lateFilter === "all"
            ? undefined
            : lateFilter === "late"
              ? true
              : lateFilter === "ontime"
                ? false
                : undefined,
      });
    }
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
      SubmissionStatus,
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600",
      label: String(status),
    };
    return (
      <span className={c.className}>
        {c.icon}
        {c.label}
      </span>
    );
  };

  const renderLateBadge = (lateMinutes: number | null | undefined) => {
    const isLate = lateMinutes != null && lateMinutes > 0;
    if (isLate) {
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
          title={`Late by ${lateMinutes} minutes`}
        >
          <ClockCircleOutlined className="text-sm" />
          +{lateMinutes} min
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
        <CheckCircleOutlined className="text-sm text-emerald-500" />
        On time
      </span>
    );
  };

  const columns: ColumnsType<ReportSubmissionHistoryResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          Creator
        </div>
      ),
      dataIndex: "creatorName",
      key: "creatorName",
      width: 140,
      render: (name: string) => (
        <span className="font-medium text-gray-800 text-sm">{name ?? "—"}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-violet-500 rounded-full" />
          Reviewer
        </div>
      ),
      dataIndex: "reviewerName",
      key: "reviewerName",
      width: 140,
      render: (name: string) => (
        <span className="font-medium text-gray-800 text-sm">{name ?? "—"}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-teal-500 rounded-full" />
          Submitted at
        </div>
      ),
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 180,
      render: (val: string) => (
        <span className="font-medium text-gray-700 text-sm">
          {val ? dayjs(val).format("MMM D, YYYY HH:mm") : "—"}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-amber-500 rounded-full" />
          Review comment
        </div>
      ),
      dataIndex: "reviewComment",
      key: "reviewComment",
      ellipsis: true,
      render: (comment: string | null) => (
        <span className="font-medium text-gray-600 text-sm">{comment ?? "—"}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: SubmissionStatus) => renderStatusBadge(status),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-slate-500 rounded-full" />
          Late
        </div>
      ),
      key: "late",
      width: 110,
      render: (_: unknown, record: ReportSubmissionHistoryResponse) =>
        renderLateBadge(record.lateMinutes),
    },
  ];

  return (
    <div >
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Submission history"
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
              <Select<SubmissionStatus | undefined>
                placeholder="Status"
                allowClear
                className="w-full sm:w-32 lg:w-28 xl:w-32"
                size="middle"
                value={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
                onClear={() => setCurrentPage(1)}
                options={STATUS_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              <Select<UserRole | undefined>
                placeholder="Role"
                allowClear
                className="w-full sm:w-32 lg:w-28 xl:w-32"
                size="middle"
                value={roleFilter}
                onChange={(v) => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }}
                onClear={() => setCurrentPage(1)}
                options={ROLE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              <Select<string>
                placeholder="Late"
                className="w-full sm:w-28 lg:w-24 xl:w-28"
                size="middle"
                value={lateFilter}
                onChange={(v) => {
                  setLateFilter(v ?? "all");
                  setCurrentPage(1);
                }}
                options={LATE_OPTIONS}
              />
            </div>
          }
        />

        <Table<ReportSubmissionHistoryResponse>
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
              `Showing ${range[0]}-${range[1]} of ${total} submissions`,
          }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          locale={{
            emptyText: "No submission history found",
          }}
          onRow={(record) => ({
            onClick: () =>
              navigate(`/report/reports/${reportId}/history/${record.submissionId}`),
            style: { cursor: "pointer" },
          })}
          rowClassName={() => "hover:bg-gray-50"}
        />
      </div>
    </div>
  );
};

export default ReportHistory;
