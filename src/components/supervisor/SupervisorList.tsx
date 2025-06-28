import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import SupervisorService from "../../services/SupervisorService";
import SectionHeader from "../common/SectionHeader";
import type { SupervisorSimple } from "../../types/supervisor";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import SupervisorAddModal from "./SupervisorAddModal";
import { useNavigate } from "react-router-dom";

const SupervisorList = () => {
  const [supervisors, setSupervisors] = useState<SupervisorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchSupervisors(searchValue);
    }, 500),
    []
  );

  const fetchSupervisors = (search?: string) => {
    setLoading(true);
    SupervisorService.getAllSupervisors(search)
      .then((data) => setSupervisors(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch supervisors");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSupervisors();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchSupervisors(searchText);
  };

  const columns: ColumnsType<SupervisorSimple> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
    },
    {
      title: "Supervisor Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
                value={searchText}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Supervisor
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={supervisors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} supervisors`,
          }}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No supervisors found matching "${searchText}"`
              : "No supervisors available",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/resource/supervisor/${record.id}`),
            style: { cursor: "pointer" },
          })}
          rowClassName={() => "hover:bg-gray-100"} // Hover effect
        />
      </div>

      <SupervisorAddModal
        visible={modalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default SupervisorList;
