import { useEffect, useState } from "react";
import { Card, Table, Spin, Alert, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { TemplateSubmission } from "../../../types/template";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TemplateService } from "../../../services/TempletService";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

interface TemplateHistoryProps {
  templateRequestId: string;
}

const TemplateHistory = ({ templateRequestId }: TemplateHistoryProps) => {
  const [submissions, setSubmissions] = useState<TemplateSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const fetchSubmissions = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response = await TemplateService.fetchTemplateSubmissions(
        Number(templateRequestId),
        { page, size }
      );

      setSubmissions(response.content);
      if (response.pagination) {
        setTotalElements(response.pagination.totalElements);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load template history");
      console.error("Error fetching template submissions:", err);
      setSubmissions([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage - 1, pageSize);
  }, [templateRequestId]);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize: newPageSize } = pagination;
    setCurrentPage(current);
    setPageSize(newPageSize);
    fetchSubmissions(current - 1, newPageSize);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          color: "success",
          icon: <CheckCircleOutlined />,
          text: status,
        };
      case "PENDING":
        return {
          color: "warning",
          icon: <ClockCircleOutlined />,
          text: status,
        };
      case "REJECTED":
        return {
          color: "error",
          icon: <CloseCircleOutlined />,
          text: status,
        };
      default:
        return {
          color: "default",
          icon: <ClockCircleOutlined />,
          text: status,
        };
    }
  };

  const getVersionLabel = (index: number, total: number) => {
    if (index === 0) return "Current";
    const versionNumber = total - index;
    return `v${versionNumber}`;
  };

  const columns: ColumnsType<TemplateSubmission & { index: number }> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Version
        </div>
      ),
      key: "version",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-full font-semibold text-sm ${
              record.index === 0
                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {getVersionLabel(record.index, totalElements)}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => renderStatusBadge(status),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <CalendarOutlined className="text-orange-500" />
          Created Date
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
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
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <UserOutlined className="text-indigo-500" />
          Reviewer
        </div>
      ),
      dataIndex: "reviewerEmpId",
      key: "reviewerEmpId",
      width: 140,
      render: (reviewerId: number | null) => (
        <div className="text-sm text-gray-600">
          {reviewerId ? (
            <span className="font-medium">{reviewerId}</span>
          ) : (
            <span className="text-gray-400 italic">Not reviewed</span>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Comment
        </div>
      ),
      dataIndex: "reviewComment",
      key: "reviewComment",
      render: (comment: string | null) => (
        <div className="text-sm text-gray-600 max-w-xs">
          {comment ? (
            <span className="line-clamp-2">{comment}</span>
          ) : (
            <span className="text-gray-400 italic">No comment</span>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" tip="Loading submission history..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  const dataWithIndex = submissions.map((item, index) => ({
    ...item,
    index,
  }));

  return (
    <div className="pb-6">
      <Table
        dataSource={dataWithIndex}
        columns={columns}
        rowKey="submissionId"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalElements,
          pageSizeOptions: ["10", "20", "50"],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} submissions`,
        }}
        scroll={{ x: 600 }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () =>
            navigate(
              `/report/template/${templateRequestId}/submissions/${record.submissionId}`
            ),
          className: "cursor-pointer",
        })}
        bordered
        size="middle"
        className="shadow-sm"
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No submission history available"
            />
          ),
        }}
      />
    </div>
  );
};

export default TemplateHistory;