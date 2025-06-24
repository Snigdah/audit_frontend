import { useEffect, useState, useCallback } from "react";
import { Button, Input, Space, Table, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Department } from "../../types/department";
import DepartmentService from "../../services/DepartmentService";
import SectionHeader from "../common/SectionHeader";
import DepartmentAddOrUpdate from "./DepartmentAddOrUpdate";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";

const DepartmentList = ({ floorId }: { floorId: string }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ Correct API call
  const fetchDepartments = () => {
    setLoading(true);
    DepartmentService.getDepartmentsByFloorId(Number(floorId))
      .then((res) => setDepartments(res))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch departments");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, [floorId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Department) => {
    setSelectedDepartment(record);
    setModalVisible(true);
  };

  const handleDeleteClick = (record: Department) => {
    setSelectedDepartment(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedDepartment) return;
    setDeleteLoading(true);
    DepartmentService.deleteDepartment(selectedDepartment.id)
      .then(() => {
        message.success(
          `Department "${selectedDepartment.name}" deleted successfully`
        );
        fetchDepartments();
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete department");
      })
      .finally(() => setDeleteLoading(false));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDepartment(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchDepartments();
  };

  // ✅ Frontend filtering
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dept.id.toString().includes(searchText)
  );

  const columns: ColumnsType<Department> = [
    {
      title: "Department ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 130,
    },
    {
      title: "Department Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClick(record)}
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
          title="Department Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search departments..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                value={searchText}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Dept
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={filteredDepartments}
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

      <DepartmentAddOrUpdate
        visible={modalVisible}
        editingData={selectedDepartment}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        floorId={Number(floorId)}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        description={`Are you sure you want to delete "${selectedDepartment?.name}"?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default DepartmentList;
