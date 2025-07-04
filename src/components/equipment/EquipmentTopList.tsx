import { useEffect, useState } from "react";
import type { EquipmentResponse } from "../../types/equipment";
import EquipmentService from "../../services/EquipmentService";
import type { ColumnsType } from "antd/es/table";
import { Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import { Table, Button, Space, message, Input } from "antd";
import EquipmentAddOrUpdate from "./EquipmentAddOrUpdate";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import { useNavigate } from "react-router-dom";

const EquipmentTopList = () => {
  const [equipment, setEquipment] = useState<EquipmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchEquipment = () => {
    setLoading(true);
    EquipmentService.getAllEquipments()
      .then((res) => setEquipment(res))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch equipment");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAdd = () => {
    setSelectedEquipment(null);
    setModalVisible(true);
  };

  const handleEdit = (record: EquipmentResponse) => {
    setSelectedEquipment(record);
    setModalVisible(true);
  };

  const handleDeleteClick = (record: EquipmentResponse) => {
    setSelectedEquipment(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedEquipment) return;

    setDeleteLoading(true);
    EquipmentService.deleteEquipment(selectedEquipment.id)
      .then(() => {
        toast.warning(
          `Equipment "${selectedEquipment.equipmentName}" deleted successfully`
        );
        fetchEquipment();
        setDeleteModalVisible(false);
      })
      .catch((error: any) => {
        toast.error(
          error.response?.data?.devMessage || "Failed to delete equipment"
        );
      })
      .finally(() => setDeleteLoading(false));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEquipment(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchEquipment();
  };

  const filteredEquipment = equipment.filter(
    (item) =>
      item.equipmentName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.equipmentNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toString().includes(searchText)
  );

  const columns: ColumnsType<EquipmentResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
          Equipment Number
        </div>
      ),
      dataIndex: "equipmentNumber",
      key: "equipmentNumber",
      sorter: (a, b) => a.equipmentNumber.localeCompare(b.equipmentNumber),
      width: 180,
      render: (equipmentNumber: string) => (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full border border-slate-300">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="font-mono text-slate-700 text-sm font-semibold">
                {equipmentNumber}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
          Equipment Name
        </div>
      ),
      dataIndex: "equipmentName",
      key: "equipmentName",
      sorter: (a, b) => a.equipmentName.localeCompare(b.equipmentName),
      render: (equipmentName: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {equipmentName}
            </div>
            <div className="text-xs text-gray-500">Equipment</div>
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
          <Tooltip title="Edit Equipment" placement="top">
            <Button
              type="text"
              size="middle"
              icon={
                <EditOutlined className="text-blue-600 hover:text-blue-700 transition-colors" />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-blue-700 font-medium text-sm">Edit</span>
            </Button>
          </Tooltip>
          <Tooltip title="Delete Equipment" placement="top">
            <Button
              type="text"
              size="middle"
              icon={
                <DeleteOutlined className="text-red-600 hover:text-red-700 transition-colors" />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(record);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
          title="Equipment Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search equipment..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Equipment
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={filteredEquipment}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} equipment`,
          }}
          scroll={{ x: 50 }}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          onRow={(record) => ({
            onClick: () => {
              navigate(`/infrastructure/equipment/${record.id}`);
            },
          })}
        />
      </div>

      <EquipmentAddOrUpdate
        visible={modalVisible}
        editingData={selectedEquipment}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Equipment"
        description={`Are you sure you want to delete "${selectedEquipment?.equipmentName}"?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default EquipmentTopList;
