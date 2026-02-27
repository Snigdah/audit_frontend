import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Empty, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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

  const fetchList = useCallback(
    async (page: number = 1, size: number = 10) => {
      setLoading(true);
      try {
        const res = await ReportSubmissionService.fetchStructureChangeSubmissions(
          Number(reportId),
          { page: page - 1, size }
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

  useEffect(() => {
    fetchList(currentPage, pageSize);
  }, [fetchList, currentPage, pageSize]);

  useEffect(() => {
    const onRefresh = () => fetchList(currentPage, pageSize);
    window.addEventListener("structure-change-list-refresh", onRefresh);
    return () => window.removeEventListener("structure-change-list-refresh", onRefresh);
  }, [fetchList, currentPage, pageSize]);

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
            onOpenChangeRequest ? (
              <CustomButton
                onClick={onOpenChangeRequest}
                icon={<EditOutlined />}
                className="bg-gray-800 hover:bg-gray-700 border-none text-white"
              >
                Change Request
              </CustomButton>
            ) : undefined
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
