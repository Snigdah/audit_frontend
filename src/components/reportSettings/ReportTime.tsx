import { useEffect, useState, useCallback } from "react";
import { ReportTimeService } from "../../services/ReportTimeService";
import type { ReportTimeResponse } from "../../types/reportTime";
import {
  Card,
  Button,
  TimePicker,
  Modal,
  Checkbox,
  Empty,
  message,
  Tooltip,
  Dropdown,
  Pagination,
  Spin,
} from "antd";
import {
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ScheduleOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
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
      toast.success("Time slot added successfully");
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
      toast.success("Time slot deleted successfully");
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
    if (hour >= 6 && hour < 12) return { bg: "bg-amber-500", text: "Morning", color: "#f59e0b" };
    if (hour >= 12 && hour < 17) return { bg: "bg-blue-500", text: "Afternoon", color: "#3b82f6" };
    if (hour >= 17 && hour < 21) return { bg: "bg-purple-500", text: "Evening", color: "#a855f7" };
    return { bg: "bg-slate-600", text: "Night", color: "#475569" };
  };

  // Pagination calculations
  const totalItems = timeSlots.length;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedSlots = timeSlots.slice(startIndex, endIndex);
  const showPagination = totalItems > PAGE_SIZE;

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
        <p className="mt-4 text-gray-500 text-sm">Loading time slots...</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <ScheduleOutlined className="text-gray-800 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 m-0">
              Report Schedule
            </h3>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              {timeSlots.length} time slot{timeSlots.length !== 1 ? "s" : ""} configured
            </p>
          </div>
        </div>
        <CustomButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-700 border-none shadow-sm"
        >
          Add Time Slot
        </CustomButton>
      </div>

      {/* Time Scale Visualization */}
      {timeSlots.length > 0 && (
        <Card className="border border-gray-200 shadow-sm" bodyStyle={{ padding: '20px' }}>
          <div className="flex items-center gap-2 mb-4">
            <ClockCircleOutlined className="text-gray-700 text-base" />
            <span className="text-sm font-medium text-gray-700">24-Hour Timeline</span>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Hour markers - Desktop */}
            <div className="hidden sm:flex justify-between text-xs text-gray-400 mb-2">
              {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour) => (
                <span key={hour} className="w-8 text-center">
                  {hour === 24 ? "00" : hour.toString().padStart(2, "0")}:00
                </span>
              ))}
            </div>
            {/* Mobile hour markers */}
            <div className="flex sm:hidden justify-between text-xs text-gray-400 mb-2">
              {[0, 6, 12, 18, 24].map((hour) => (
                <span key={hour} className="text-center">
                  {hour === 24 ? "00" : hour.toString().padStart(2, "0")}
                </span>
              ))}
            </div>

            {/* Timeline Bar with realistic gradient */}
            <div className="relative h-14 rounded-lg overflow-hidden shadow-inner border border-gray-200">
              {/* Base gradient simulating day cycle */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-amber-300 via-sky-400 via-orange-300 via-purple-400 to-slate-800"></div>
              
              {/* Overlay for depth and realism */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)'
              }}></div>

              {/* Time slot markers */}
              {timeSlots.map((slot) => {
                const position = getTimePosition(slot.time);
                const timeInfo = getTimeColor(slot.time);
                return (
                  <Tooltip
                    key={slot.id}
                    title={`${formatTimeDisplay(slot.time)} - ${timeInfo.text}`}
                    color="#1f2937"
                  >
                    <div
                      className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
                      style={{ left: `${position}%`, marginLeft: '-8px' }}
                    >
                      <div className="relative">
                        {/* Main marker */}
                        <div 
                          className="w-4 h-4 bg-white rounded-full shadow-lg border-2 flex items-center justify-center"
                          style={{ borderColor: timeInfo.color }}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: timeInfo.color }}
                          />
                        </div>
                        {/* Subtle pulse */}
                        <div 
                          className="absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-25"
                          style={{ backgroundColor: timeInfo.color }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 justify-start">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <span className="text-xs text-gray-600">Night (9PM-6AM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600">Morning (6AM-12PM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Afternoon (12PM-5PM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                <span className="text-xs text-gray-600">Evening (5PM-9PM)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Time Slots List */}
      <Card
        className="border border-gray-200 shadow-sm"
        bodyStyle={{ padding: timeSlots.length === 0 ? "40px 20px" : "20px" }}
      >
        {timeSlots.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500 text-sm">No time slots configured yet</span>
            }
          >
            <CustomButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 border-none mt-3"
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
                    className="group relative flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                        <ClockCircleOutlined 
                          className="text-base"
                          style={{ color: timeInfo.color }}
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800 m-0">
                          {formatTimeDisplay(slot.time)}
                        </p>
                        <p className="text-xs text-gray-500 m-0 mt-0.5">
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
                        icon={<MoreOutlined className="text-gray-500" />}
                       // className="hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        className="
                          hover:bg-gray-100
                          opacity-100 sm:opacity-0
                          sm:group-hover:opacity-100
                          transition-opacity
                        "
                      />
                    </Dropdown>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="flex justify-center mt-5 pt-4 border-t border-gray-100">
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
                  className="[&_.ant-pagination-item-active]:bg-gray-800 [&_.ant-pagination-item-active]:border-gray-800"
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add Time Slot Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-md border border-gray-200">
              <ClockCircleOutlined className="text-gray-800 text-base" />
            </div>
            <span className="font-semibold text-gray-800">Add Time Slot</span>
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
        width={440}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Checkbox
              checked={isAppliedFromToday}
              onChange={(e) => setIsAppliedFromToday(e.target.checked)}
              className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-gray-800 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-gray-800"
            >
              <span className="text-gray-700 text-sm">Apply from today</span>
            </Checkbox>
            <p className="text-xs text-gray-500 mt-1.5 ml-6">
              The time slot will be active starting from today
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
              className="bg-gray-800 hover:bg-gray-700 border-none"
            >
              Add Time Slot
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Delete Time Slot Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-md border border-red-200">
              <ExclamationCircleOutlined className="text-red-600 text-base" />
            </div>
            <span className="font-semibold text-gray-800">Delete Time Slot</span>
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
        width={440}
      >
        <div className="py-4 space-y-4">
          {/* Time slot info */}
          {deleteSlot && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                <ClockCircleOutlined 
                  className="text-base"
                  style={{ color: getTimeColor(deleteSlot.time).color }}
                />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800 m-0">
                  {formatTimeDisplay(deleteSlot.time)}
                </p>
                <p className="text-xs text-gray-500 m-0 mt-0.5">
                  {getTimeColor(deleteSlot.time).text}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Are you sure you want to delete this time slot? This action cannot be undone.
          </p>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Checkbox
              checked={deleteAppliedFromToday}
              onChange={(e) => setDeleteAppliedFromToday(e.target.checked)}
              className="[&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-gray-800 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-gray-800"
            >
              <span className="text-gray-700 text-sm">Apply from today</span>
            </Checkbox>
            <p className="text-xs text-gray-500 mt-1.5 ml-6">
              The deletion will take effect starting from today
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