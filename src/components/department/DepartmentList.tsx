import { useEffect, useState, useCallback } from "react";
import { Button, Input, Space, Table, Tooltip, message } from "antd";
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
import { toast } from "../common/Toast";

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
        toast.error(
        err.response?.data?.devMessage || "Failed to delete department"
      );
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
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Actions
        </div>
      ),
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small" className="flex justify-end">
          <Tooltip title="Edit Department" placement="top">
              <Button
                type="text"
                size="small"
                icon={
                <EditOutlined className="text-blue-600 hover:text-blue-700 transition-colors" />
              }
                onClick={() => handleEdit(record)}
                 className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
               <span className="text-blue-700 font-medium text-sm">Edit</span>
            </Button>
         </Tooltip>
        <Tooltip title="Delete Department" placement="top"> 
              <Button
                type="text"
                size="small"
                danger
                 icon={
                <DeleteOutlined className="text-red-600 hover:text-red-700 transition-colors" />
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(record);
              }}
            >
              <span className="text-red-700 font-medium text-sm">Delete</span>
              </Button>
        </Tooltip>        
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
