import { useCallback, useEffect, useState } from "react";
import { Table, Tag, Spin, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { ReportSubmissionService } from "../../services/ReportSubmissionService";
import type {
  ReportSubmissionSimpleResponse,
  SubmissionStatus,
} from "../../types/reportSubmission";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface SubmissionListProps {
  reportId: string;
  expectedSubmissionId: string;
  onOpenCreate?: () => void;
}

const SubmissionList = ({
  reportId,
  expectedSubmissionId,
  onOpenCreate,
}: SubmissionListProps) => {
  const [submissions, setSubmissions] = useState<
    ReportSubmissionSimpleResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSubmissions = useCallback(
    async (page: number = 1, size: number = 10) => {
      setLoading(true);
      try {
        const res = await ReportSubmissionService.fetchByExpectedSubmission(
          Number(expectedSubmissionId),
          { page: page - 1, size }
        );
        setSubmissions(res.content ?? []);
        setTotalElements(res.pagination?.totalElements ?? 0);
      } catch (err) {
        console.error(err);
        message.error("Failed to load submissions");
        setSubmissions([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    },
    [expectedSubmissionId]
  );

  useEffect(() => {
    fetchSubmissions(currentPage, pageSize);
  }, [fetchSubmissions, currentPage, pageSize]);

  useEffect(() => {
    const onRefresh = () => fetchSubmissions(currentPage, pageSize);
    window.addEventListener("submission-list-refresh", onRefresh);
    return () => window.removeEventListener("submission-list-refresh", onRefresh);
  }, [fetchSubmissions, currentPage, pageSize]);

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    if (pagination.current != null) setCurrentPage(pagination.current);
    if (pagination.pageSize != null) setPageSize(pagination.pageSize);
  };

  const getStatusConfig = (status: SubmissionStatus) => {
    switch (status) {
      case "APPROVED":
        return { color: "success", icon: <CheckCircleOutlined />, text: "Approved" };
      case "PENDING":
      case "NO_APPROVAL":
        return { color: "warning", icon: <ClockCircleOutlined />, text: status === "PENDING" ? "Pending" : "No approval" };
      case "REJECTED":
        return { color: "error", icon: <CloseCircleOutlined />, text: "Rejected" };
      default:
        return { color: "default", icon: <ClockCircleOutlined />, text: String(status) };
    }
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
      width: 160,
      responsive: ["sm"],
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
      render: (status: SubmissionStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className="px-2 py-0.5 text-xs">
            {config.text}
          </Tag>
        );
      },
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
      responsive: ["md"],
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
          Creator
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
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col gap-6">
        <SectionHeader
          title="Submissions"
          rightContent={
            onOpenCreate ? (
              <CustomButton
                onClick={onOpenCreate}
                icon={<PlusOutlined />}
                className="bg-gray-800 hover:bg-gray-700 border-none text-white"
              >
                Create Submission
              </CustomButton>
            ) : undefined
          }
        />
        <Table
          dataSource={submissions}
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
          scroll={{ x: 600 }}
          onChange={handleTableChange}
          bordered
          size="middle"
          className="shadow-sm"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No submissions yet"
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default SubmissionList;
