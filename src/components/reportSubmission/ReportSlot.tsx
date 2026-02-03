import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, message, Spin, Pagination } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ReportTimeService } from "../../services/ReportTimeService";
import type {
  ExpectedSlotStatusResponse,
  SlotDisplayStatus,
} from "../../types/reportTime";
import { Clock } from "lucide-react";

interface ReportSlotProps {
  reportId: string;
}

const PAGE_SIZE = 12;
const PAGE_SIZE_OPTIONS = [12, 24, 48];

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

/** Card styling by status – whole card color. NO_SUBMISSION = danger (past, nobody submitted). */
const statusCardConfig: Record<
  SlotDisplayStatus,
  {
    label: string;
    cardClass: string;
    textClass: string;
    iconClass: string;
  }
> = {
  INCOMING: {
    label: "Incoming",
    cardClass:
      "bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100/80",
    textClass: "text-blue-900",
    iconClass: "text-blue-600",
  },
  PENDING: {
    label: "Pending",
    cardClass:
      "bg-amber-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100/80",
    textClass: "text-amber-900",
    iconClass: "text-amber-600",
  },
  APPROVED: {
    label: "Approved",
    cardClass:
      "bg-emerald-50 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100/80",
    textClass: "text-emerald-900",
    iconClass: "text-emerald-600",
  },
  NO_SUBMISSION: {
    label: "No submission",
    cardClass:
      "bg-red-50 border-red-200 hover:border-red-300 hover:bg-red-100/80",
    textClass: "text-red-900",
    iconClass: "text-red-600",
  },
  ALL_REJECTED: {
    label: "All rejected",
    cardClass:
      "bg-rose-100/80 border-rose-300 hover:border-rose-400 hover:bg-rose-200/80",
    textClass: "text-rose-900",
    iconClass: "text-rose-600",
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
    if (date) {
      setSelectedDate(date);
      setCurrentPage(1);
    }
  };

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
            <p className="mt-3 text-xs text-gray-500">
              Card color = status. Red = past with no submission or rejected.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">
                {selectedDate.format("dddd, MMM D, YYYY")}
              </span>
              {loading && <Spin size="small" tip="Loading slots…" />}
            </div>

            {loading ? (
              <div className="min-h-[200px] flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50">
                <Spin tip="Loading slots…" />
              </div>
            ) : displayRows.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 text-gray-500 text-sm">
                No expected slots for this date.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paginatedData.map((row) => {
                    const config =
                      statusCardConfig[row.displayStatus] ??
                      statusCardConfig.NO_SUBMISSION;
                    return (
                      <div
                        key={`${row.time}-${row.displayStatus}`}
                        className={`rounded-xl border-2 transition-all duration-200 p-4 flex flex-col justify-center min-h-[88px] ${config.cardClass}`}
                      >
                        <div
                          className={`flex items-center gap-2 font-semibold text-lg ${config.textClass}`}
                        >
                          <Clock
                            className={`w-5 h-5 shrink-0 ${config.iconClass}`}
                          />
                          {formatTime(row.time)}
                        </div>
                        <span
                          className={`mt-1 text-xs font-medium ${config.textClass} opacity-90`}
                        >
                          {config.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {displayRows.length > pageSize && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-gray-500">
                      Showing {(currentPage - 1) * pageSize + 1}–
                      {Math.min(
                        currentPage * pageSize,
                        displayRows.length
                      )}{" "}
                      of {displayRows.length} slots
                    </span>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={displayRows.length}
                      pageSizeOptions={PAGE_SIZE_OPTIONS}
                      showSizeChanger
                      showQuickJumper
                      onChange={(page, size) => {
                        setCurrentPage(page);
                        if (size) setPageSize(size);
                      }}
                      size="small"
                      className="[&_.ant-pagination-item]:rounded-md"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSlot;
