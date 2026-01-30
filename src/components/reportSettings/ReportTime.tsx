import { useEffect, useState, useCallback } from "react";
import { ReportTimeService } from "../../services/ReportTimeService";
import type { ReportTimeResponse } from "../../types/reportTime";
import {
  Card,
  Skeleton,
  Button,
  TimePicker,
  Modal,
  Checkbox,
  Empty,
  message,
  Tooltip,
  Dropdown,
  Pagination,
} from "antd";
import {
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ScheduleOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "../common/Toast";
import CustomButton from "../common/CustomButton";

interface ReportTimeProps {
  reportId: string;
}

const PAGE_SIZE = 8;

const ReportTime = ({ reportId }: ReportTimeProps) => {
  const [timeSlots, setTimeSlots] = useState<ReportTimeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [isAppliedFromToday, setIsAppliedFromToday] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteSlot, setDeleteSlot] = useState<ReportTimeResponse | null>(null);
  const [deleteAppliedFromToday, setDeleteAppliedFromToday] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTimeSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ReportTimeService.fetchTimeSlots(Number(reportId));
      // Sort time slots chronologically
      const sorted = [...data].sort((a, b) => a.time.localeCompare(b.time));
      setTimeSlots(sorted);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      message.error("Failed to load time slots");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Reset to page 1 if current page becomes invalid after deletion
  useEffect(() => {
    const totalPages = Math.ceil(timeSlots.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [timeSlots.length, currentPage]);

  const handleAddTimeSlot = async () => {
    if (!selectedTime) {
      message.warning("Please select a time");
      return;
    }

    try {
      setSubmitting(true);
      await ReportTimeService.addTimeSlot(Number(reportId), {
        time: selectedTime.format("HH:mm:ss"),
        isAppliedFromToday,
      });
      message.success("Time slot added successfully");
      setIsAddModalOpen(false);
      setSelectedTime(null);
      setIsAppliedFromToday(true);
      fetchTimeSlots();
    } catch (error: any) {
      console.error("Error adding time slot:", error);
      toast.error(
        error.response?.data?.devMessage || "Failed to add time slot"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (slot: ReportTimeResponse) => {
    setDeleteSlot(slot);
    setDeleteAppliedFromToday(true);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTimeSlot = async () => {
    if (!deleteSlot) return;

    try {
      setDeleting(true);
      await ReportTimeService.deleteTimeSlot(
        Number(reportId),
        deleteSlot.id,
        deleteAppliedFromToday
      );
      message.success("Time slot removed successfully");
      setIsDeleteModalOpen(false);
      setDeleteSlot(null);
      setDeleteAppliedFromToday(true);
      fetchTimeSlots();
    } catch (error: any) {
      console.error("Error deleting time slot:", error);
      toast.error(
        error.response?.data?.devMessage || "Failed to delete time slot"
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const getTimeColor = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 6 && hour < 12) return { bg: "bg-amber-500", text: "Morning" };
    if (hour >= 12 && hour < 17)
      return { bg: "bg-orange-500", text: "Afternoon" };
    if (hour >= 17 && hour < 21) return { bg: "bg-purple-500", text: "Evening" };
    return { bg: "bg-indigo-600", text: "Night" };
  };

  // Pagination calculations
  const totalItems = timeSlots.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedSlots = timeSlots.slice(startIndex, endIndex);
  const showPagination = totalItems > PAGE_SIZE;

  if (loading) {
    return (
      <div className="py-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 p-2.5 rounded-lg">
            <ScheduleOutlined className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 m-0">
              Report Schedule
            </h3>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {timeSlots.length} time slot{timeSlots.length !== 1 ? "s" : ""}{" "}
              configured
            </p>
          </div>
        </div>
        <CustomButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 border-none shadow-sm"
        >
          Add Time Slot
        </CustomButton>
      </div>

      {/* Time Scale Visualization */}
      {timeSlots.length > 0 && (
        <Card
          className="mb-6 border border-slate-200 shadow-sm overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <ClockCircleOutlined className="text-blue-900" />
              <span className="text-sm font-medium text-slate-700">
                24-Hour Timeline
              </span>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Hour markers - Desktop */}
              <div className="hidden sm:flex justify-between text-xs text-slate-400 mb-2">
                {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour) => (
                  <span key={hour} className="w-8 text-center">
                    {hour === 24 ? "00" : hour.toString().padStart(2, "0")}:00
                  </span>
                ))}
              </div>
              {/* Mobile hour markers */}
              <div className="flex sm:hidden justify-between text-xs text-slate-400 mb-2">
                {[0, 6, 12, 18, 24].map((hour) => (
                  <span key={hour} className="text-center">
                    {hour === 24 ? "00" : hour.toString().padStart(2, "0")}
                  </span>
                ))}
              </div>

              {/* Timeline Bar */}
              <div className="relative h-12 sm:h-14 bg-gradient-to-r from-indigo-900 via-blue-600 via-amber-500 via-orange-500 via-purple-600 to-indigo-900 rounded-lg overflow-hidden shadow-inner">
                {/* Day/Night gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-transparent via-transparent via-transparent to-slate-900/60" />

                {/* Period labels */}
                <div className="absolute inset-0 flex items-center justify-around text-white/70 text-xs font-medium pointer-events-none">
                  <span className="hidden md:inline">Night</span>
                  <span className="hidden md:inline">Morning</span>
                  <span className="hidden md:inline">Afternoon</span>
                  <span className="hidden md:inline">Evening</span>
                  <span className="hidden md:inline">Night</span>
                </div>

                {/* Time slot markers */}
                {timeSlots.map((slot) => {
                  const position = getTimePosition(slot.time);
                  const timeInfo = getTimeColor(slot.time);
                  return (
                    <Tooltip
                      key={slot.id}
                      title={`${formatTimeDisplay(slot.time)} (${timeInfo.text})`}
                    >
                      <div
                        className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                        style={{ left: `${position}%` }}
                      >
                        <div className="relative">
                          {/* Marker pin */}
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg border-2 border-blue-900 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-900 rounded-full" />
                          </div>
                          {/* Pulse effect */}
                          <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full animate-ping opacity-30" />
                        </div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span className="text-xs text-slate-500">
                    Night (9PM-6AM)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-500">
                    Morning (6AM-12PM)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-slate-500">
                    Afternoon (12PM-5PM)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-500">
                    Evening (5PM-9PM)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Time Slots List */}
      <Card
        className="border border-slate-200 shadow-sm"
        bodyStyle={{ padding: timeSlots.length === 0 ? "40px 20px" : "16px" }}
      >
        {timeSlots.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                No time slots configured yet
              </span>
            }
          >
            <CustomButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 border-none"
            >
              Add Your First Time Slot
            </CustomButton>
          </Empty>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {paginatedSlots.map((slot) => {
                const timeInfo = getTimeColor(slot.time);
                return (
                  <div
                    key={slot.id}
                    className="relative flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${timeInfo.bg} p-2 rounded-lg shadow-sm`}>
                        <ClockCircleOutlined className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-800 m-0">
                          {formatTimeDisplay(slot.time)}
                        </p>
                        <p className="text-xs text-slate-500 m-0 mt-0.5">
                          {timeInfo.text}
                        </p>
                      </div>
                    </div>

                    {/* Triple dot dropdown menu */}
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "delete",
                            label: (
                              <span className="flex items-center gap-2 text-red-600">
                                <DeleteOutlined />
                                Delete
                              </span>
                            ),
                            onClick: () => openDeleteModal(slot),
                          },
                        ],
                      }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={<MoreOutlined className="text-slate-500" />}
                        className="hover:bg-slate-200"
                      />
                    </Dropdown>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={totalItems}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} time slots`
                  }
                  size="small"
                  responsive
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add Time Slot Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2">
            <div className="bg-blue-900 p-1.5 rounded-md">
              <ClockCircleOutlined className="text-white text-sm" />
            </div>
            <span className="font-semibold">Add Time Slot</span>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setSelectedTime(null);
          setIsAppliedFromToday(true);
        }}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-xl"
      >
        <div className="py-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Time
            </label>
            <TimePicker
              value={selectedTime}
              onChange={setSelectedTime}
              format="HH:mm"
              size="large"
              placeholder="Select time"
              className="w-full"
              showNow={false}
              needConfirm={false}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox
              checked={isAppliedFromToday}
              onChange={(e) => setIsAppliedFromToday(e.target.checked)}
            >
              <span className="text-slate-700">Apply from today</span>
            </Checkbox>
            <p className="text-xs text-slate-500 mt-1 ml-6">
              If checked, the time slot will be active starting from today
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedTime(null);
                setIsAppliedFromToday(true);
              }}
            >
              Cancel
            </Button>
            <CustomButton
              type="primary"
              onClick={handleAddTimeSlot}
              loading={submitting}
              disabled={!selectedTime}
              className="bg-gray-900 hover:bg-gray-800 border-none"
            >
              Add Time Slot
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Delete Time Slot Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-2">
            <div className="bg-red-500 p-1.5 rounded-md">
              <ExclamationCircleOutlined className="text-white text-sm" />
            </div>
            <span className="font-semibold">Delete Time Slot</span>
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteSlot(null);
          setDeleteAppliedFromToday(true);
        }}
        footer={null}
        centered
        className="[&_.ant-modal-content]:rounded-xl"
      >
        <div className="py-4 space-y-5">
          {/* Time slot info */}
          {deleteSlot && (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <div
                className={`${getTimeColor(deleteSlot.time).bg} p-2 rounded-lg`}
              >
                <ClockCircleOutlined className="text-white text-sm" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800 m-0">
                  {formatTimeDisplay(deleteSlot.time)}
                </p>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {getTimeColor(deleteSlot.time).text}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-600">
            Are you sure you want to delete this time slot? This action cannot
            be undone.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox
              checked={deleteAppliedFromToday}
              onChange={(e) => setDeleteAppliedFromToday(e.target.checked)}
            >
              <span className="text-slate-700">Apply from today</span>
            </Checkbox>
            <p className="text-xs text-slate-500 mt-1 ml-6">
              If checked, the deletion will take effect starting from today
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteSlot(null);
                setDeleteAppliedFromToday(true);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleDeleteTimeSlot}
              loading={deleting}
              className="bg-red-500 hover:bg-red-600 border-none"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportTime;