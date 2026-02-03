import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Table, Tag, message, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ReportTimeService } from "../../services/ReportTimeService";
import type {
  ExpectedSlotStatusResponse,
  ExpectedSubmissionStatus,
  SlotDisplayStatus,
} from "../../types/reportTime";

interface ReportSlotProps {
  reportId: string;
}

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = ["10", "20", "50"];

function formatTime(hhmmss: string): string {
  const [h, m] = hhmmss.split(":").map(Number);
  const hour = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function getDisplayStatus(
  slot: ExpectedSlotStatusResponse,
  selectedDate: Dayjs
): SlotDisplayStatus {
  const today = dayjs().startOf("day");
  const selected = selectedDate.startOf("day");
  if (selected.isAfter(today)) return "INCOMING";
  if (selected.isBefore(today)) return slot.status;
  const now = dayjs();
  const [h, m, s] = slot.time.split(":").map(Number);
  const slotToday = selectedDate.hour(h).minute(m).second(s ?? 0).millisecond(0);
  return slotToday.isAfter(now) ? "INCOMING" : slot.status;
}

const statusConfig: Record<
  SlotDisplayStatus,
  { color: string; label: string; bgClass?: string }
> = {
  INCOMING: {
    color: "blue",
    label: "Incoming",
    bgClass: "bg-blue-50 border-blue-200 text-blue-800",
  },
  PENDING: {
    color: "orange",
    label: "Pending",
    bgClass: "bg-amber-50 border-amber-200 text-amber-800",
  },
  ALL_REJECTED: {
    color: "red",
    label: "All Rejected",
    bgClass: "bg-red-50 border-red-200 text-red-800",
  },
  NO_SUBMISSION: {
    color: "default",
    label: "No Submission",
    bgClass: "bg-gray-50 border-gray-200 text-gray-700",
  },
  APPROVED: {
    color: "green",
    label: "Approved",
    bgClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
};

const ReportSlot = ({ reportId }: ReportSlotProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() => dayjs());
  const [slots, setSlots] = useState<ExpectedSlotStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const businessDate = selectedDate.format("YYYY-MM-DD");

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ReportTimeService.fetchExpectedSlots(
        Number(reportId),
        businessDate
      );
      const sorted = [...(data ?? [])].sort((a, b) =>
        a.time.localeCompare(b.time)
      );
      setSlots(sorted);
    } catch (err) {
      console.error(err);
      message.error("Failed to load expected slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [reportId, businessDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const displayRows = useMemo(() => {
    return slots.map((slot) => ({
      ...slot,
      displayStatus: getDisplayStatus(slot, selectedDate),
    }));
  }, [slots, selectedDate]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayRows.slice(start, start + pageSize);
  }, [displayRows, currentPage, pageSize]);

  const handleCalendarSelect = (date: Dayjs | null) => {
    if (date) setSelectedDate(date);
  };

  const columns: ColumnsType<typeof displayRows[0]> = [
    {
      title: (
        <span className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
          Time
        </span>
      ),
      dataIndex: "time",
      key: "time",
      width: 140,
      sorter: (a, b) => a.time.localeCompare(b.time),
      render: (time: string) => (
        <span className="font-medium text-gray-900">{formatTime(time)}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
          Status
        </span>
      ),
      dataIndex: "displayStatus",
      key: "displayStatus",
      width: 160,
      render: (displayStatus: SlotDisplayStatus) => {
        const config = statusConfig[displayStatus] ?? statusConfig.NO_SUBMISSION;
        return (
          <Tag
            color={config.color}
            className={`font-medium text-xs border ${config.bgClass ?? ""}`}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
          Submission
        </span>
      ),
      dataIndex: "expectedSubmissionId",
      key: "expectedSubmissionId",
      render: (id: number | null) =>
        id != null ? (
          <span className="text-sm text-gray-600">#{id}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Expected time slots
          </h2>
          <p className="text-sm text-gray-500">
            Select a date to see when operators should submit for that day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
              <Calendar
                fullscreen={false}
                value={selectedDate}
                onChange={handleCalendarSelect}
                className="rounded-xl [&_.ant-picker-calendar]:rounded-xl"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  "INCOMING",
                  "PENDING",
                  "APPROVED",
                  "NO_SUBMISSION",
                  "ALL_REJECTED",
                ] as SlotDisplayStatus[]
              ).map((s) => {
                const c = statusConfig[s];
                return (
                  <Tag
                    key={s}
                    color={c.color}
                    className={`text-xs border ${c.bgClass ?? ""}`}
                  >
                    {c.label}
                  </Tag>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                {selectedDate.format("dddd, MMM D, YYYY")}
              </span>
              {loading && (
                <Spin size="small" tip="Loading slots…" />
              )}
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden flex-1">
              <Table
                dataSource={paginatedData}
                columns={columns}
                rowKey={(r) => `${r.time}-${r.expectedSubmissionId ?? "n"}`}
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize,
                  pageSizeOptions: PAGE_SIZE_OPTIONS,
                  total: displayRows.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `Showing ${range[0]}-${range[1]} of ${total} slots`,
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    if (size) setPageSize(size);
                  },
                }}
                size="middle"
                bordered
                locale={{
                  emptyText: loading
                    ? "Loading…"
                    : "No expected slots for this date.",
                }}
                className="shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSlot;
