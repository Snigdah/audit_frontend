import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DepartmentService from "../../services/DepartmentService";
import SectionHeader from "../common/SectionHeader";
import type { Department } from "../../types/department";
import { debounce } from "lodash";

const DepartmentTopList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchDepartments(searchValue);
    }, 500),
    []
  );

  const fetchDepartments = (search?: string) => {
    setLoading(true);
    DepartmentService.getDepartments(search)
      .then((data) => setDepartments(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch departments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const columns: ColumnsType<Department> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100,
    },
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Department Management"
          rightContent={
            <Input
              placeholder="Search departments..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearchChange}
              value={searchText}
              allowClear
              className="w-64"
            />
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
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No departments found matching "${searchText}"`
              : "No departments available",
          }}
        />
      </div>
    </div>
  );
};

export default DepartmentTopList;
