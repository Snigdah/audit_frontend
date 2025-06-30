import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message, Button } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import SupervisorService from "../../services/SupervisorService";
import SectionHeader from "../common/SectionHeader";
import type { SupervisorSimple } from "../../types/supervisor";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import SupervisorAddModal from "./SupervisorAddModal";
import SupervisorUpdateModal from "./SupervisorUpdateModal";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { toast } from "../common/Toast";

const SupervisorList = () => {
  const [supervisors, setSupervisors] = useState<SupervisorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | null
  >(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setAddModalVisible(true);
  };

  const handleModalClose = () => {
    setAddModalVisible(false);
    setUpdateModalVisible(false);
    setSelectedSupervisorId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchSupervisors(searchText);
  };

  const handleEdit = (record: SupervisorSimple) => {
    setSelectedSupervisorId(record.id);
    setUpdateModalVisible(true);
  };

  const handleDeleteClick = (record: SupervisorSimple) => {
    setSelectedSupervisorId(record.id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    // if (selectedSupervisorId === null) return;
    // setDeleteLoading(true);
    // SupervisorService.deleteSupervisor(selectedSupervisorId)
    //   .then(() => {
    //     toast.warning("Supervisor deleted successfully");
    //     fetchSupervisors(searchText);
    //     setDeleteModalVisible(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(err.response?.data?.devMessage || "Failed to delete supervisor");
    //   })
    //   .finally(() => setDeleteLoading(false));
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
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            className="text-primary-600 hover:bg-primary-50"
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(record);
            }}
            className="hover:bg-red-50"
          >
            Delete
          </Button>
        </Space>
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
          rowClassName={() => "hover:bg-gray-100"}
        />
      </div>

      <SupervisorAddModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <SupervisorUpdateModal
        visible={updateModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        supervisorId={selectedSupervisorId}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Supervisor"
        description="Are you sure you want to delete this supervisor?"
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default SupervisorList;
