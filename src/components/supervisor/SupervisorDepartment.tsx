import { useEffect, useState, useCallback } from "react";
import { Space, Table, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import SupervisorService from "../../services/SupervisorService";
import SectionHeader from "../common/SectionHeader";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import type { Department } from "../../types/department";

interface Props {
  supervisorId: string;
}

const SupervisorDepartment = ({ supervisorId }: Props) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchDepartments = (search?: string) => {
    setLoading(true);
    SupervisorService.getDepartmentsBySupervisor(Number(supervisorId))
      .then((data) => {
        if (search) {
          const filtered = data.filter((department) =>
            department.name.toLowerCase().includes(search.toLowerCase())
          );
          setDepartments(filtered);
        } else {
          setDepartments(data);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch departments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, [supervisorId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchDepartments(value);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const columns: ColumnsType<Department> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
          ID
        </div>
      ),
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 80,
      render: (id: number) => (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">{id}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
          Department Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fillRule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-xs text-gray-500">Department</div>
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
      key: "status",
      width: 120,
      render: () => (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-700 text-xs font-medium">Active</span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Department Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search departments..."
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
          dataSource={departments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} departments`,
          }}
          bordered
          size="middle"
          scroll={{ x: 50 }}
          locale={{
            emptyText: searchText
              ? `No departments found matching "${searchText}"`
              : "No departments assigned to this supervisor",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/infrastructure/department/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default SupervisorDepartment;