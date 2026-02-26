import { useEffect, useState, useCallback } from "react";
import { Space, Table, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import OperatorService from "../../services/OperatorService";
import SectionHeader from "../common/SectionHeader";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import type { SupervisorSimple } from "../../types/supervisor";

interface Props {
  operatorId: string;
}

const OperatorSupervisor = ({ operatorId }: Props) => {
  const [supervisors, setSupervisors] = useState<SupervisorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const fetchSupervisors = (
    page: number = 1,
    size: number = 10,
    search?: string
  ) => {
    setLoading(true);
    OperatorService.getSupervisorByOperator(Number(operatorId), {
      page: page - 1,
      size,
      search: search || undefined,
    })
      .then((data) => {
        setSupervisors(data.content ?? []);
        setTotalElements(data.pagination?.totalElements ?? 0);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch supervisors");
        setSupervisors([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSupervisors(currentPage, pageSize, searchText);
  }, [operatorId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      fetchSupervisors(1, pageSize, value);
    }, 500),
    [pageSize]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const columns: ColumnsType<SupervisorSimple> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Employee ID
        </div>
      ),
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
      width: 140,
      render: (employeeId: string) => (
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
            <span className="font-mono text-blue-700 text-sm font-semibold">
              #{employeeId}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Supervisor Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013-3.006z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-xs text-gray-500">Supervisor</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Supervisor Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search supervisors..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                allowClear
                className="w-64"
                value={searchText}
              />
            </Space>
          }
        />

        <Table
          dataSource={supervisors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} supervisors`,
          }}
          onChange={(pagination) => {
            const { current, pageSize: newPageSize } = pagination;
            if (current) setCurrentPage(current);
            if (newPageSize) setPageSize(newPageSize);
            fetchSupervisors(current || 1, newPageSize || 10, searchText);
          }}
          bordered
          size="middle"
          scroll={{ x: 50 }}
          locale={{
            emptyText: searchText
              ? `No supervisors found matching "${searchText}"`
              : "No supervisors assigned to this operator",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/resource/supervisor/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default OperatorSupervisor;
