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
  Popconfirm,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";

interface ReportTimeProps {
  reportId: string;
}

const ReportTime = ({ reportId }: ReportTimeProps) => {
  const [timeSlots, setTimeSlots] = useState<ReportTimeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [isAppliedFromToday, setIsAppliedFromToday] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      setIsModalOpen(false);
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

  const handleDeleteTimeSlot = async (
    timeSlotId: number,
    applyFromToday: boolean = true
  ) => {
    try {
      await ReportTimeService.deleteTimeSlot(
        Number(reportId),
        timeSlotId,
        applyFromToday
      );
      message.success("Time slot removed successfully");
      fetchTimeSlots();
    } catch (error) {
      console.error("Error deleting time slot:", error);
      message.error("Failed to remove time slot");
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
    if (hour >= 12 && hour < 17) return { bg: "bg-orange-500", text: "Afternoon" };
    if (hour >= 17 && hour < 21) return { bg: "bg-purple-500", text: "Evening" };
    return { bg: "bg-indigo-600", text: "Night" };
  };

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
              {timeSlots.length} time slot{timeSlots.length !== 1 ? "s" : ""} configured
            </p>
          </div>
        </div>
        <CustomButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
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
              {/* Hour markers */}
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((hour) => (
                  <span
                    key={hour}
                    className="w-8 text-center hidden sm:inline-block"
                    style={{ transform: hour === 0 ? "none" : hour === 24 ? "none" : "translateX(-50%)" }}
                  >
                    {hour === 24 ? "00" : hour.toString().padStart(2, "0")}:00
                  </span>
                ))}
              </div>
              {/* Mobile hour markers */}
              <div className="flex justify-between text-xs text-slate-400 mb-2 sm:hidden">
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
                  <span className="text-xs text-slate-500">Night (9PM-6AM)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-500">Morning (6AM-12PM)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-slate-500">Afternoon (12PM-5PM)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs text-slate-500">Evening (5PM-9PM)</span>
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
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 border-none"
            >
              Add Your First Time Slot
            </CustomButton>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const timeInfo = getTimeColor(slot.time);
              return (
                <div
                  key={slot.id}
                  className="group relative flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${timeInfo.bg} p-2 rounded-lg shadow-sm`}
                    >
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

                  <Popconfirm
                    title="Remove Time Slot"
                    description="Are you sure you want to remove this time slot?"
                    onConfirm={() => handleDeleteTimeSlot(slot.id)}
                    okText="Yes, Remove"
                    cancelText="Cancel"
                    okButtonProps={{
                      danger: true,
                      className: "bg-red-500 hover:bg-red-600",
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Popconfirm>
                </div>
              );
            })}
          </div>
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
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
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
                setIsModalOpen(false);
                setSelectedTime(null);
                setIsAppliedFromToday(true);
              }}
            >
              Cancel
            </Button>
            {/* <Button
              type="primary"
              onClick={handleAddTimeSlot}
              loading={submitting}
              disabled={!selectedTime}
              className="bg-gray-900 hover:bg-gray-800 border-none"
            >
              Add Time Slot
            </Button> */}
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
    </div>
  );
};

export default ReportTime;