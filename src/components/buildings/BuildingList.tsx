import { useEffect, useState } from "react";
import type { BuildingResponse } from "../../types/building";
import BuildingService from "../../services/BuildingService";
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
import BuildingAddOrUpdate from "./BuildingAddOrUpdate ";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import { useNavigate } from "react-router-dom";

const BuildingList = () => {
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchBuildings = () => {
    setLoading(true);
    BuildingService.getAllBuildings()
      .then((res) => {
        setBuildings(res);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch buildings");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleAdd = () => {
    setSelectedBuilding(null);
    setModalVisible(true);
  };

  const handleEdit = (record: BuildingResponse) => {
    setSelectedBuilding(record);
    setModalVisible(true);
  };

  const handleDeleteClick = (record: BuildingResponse) => {
    setSelectedBuilding(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedBuilding) return;

    setDeleteLoading(true);
    BuildingService.deleteBuilding(selectedBuilding.id)
      .then(() => {
        toast.warning(
          `Building "${selectedBuilding.buildingName}" deleted successfully`
        );
        fetchBuildings();
        setDeleteModalVisible(false);
      })
      .catch((error: any) => {
        toast.error(
          error.response?.data?.devMessage || "Failed to delete building"
        );
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedBuilding(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchBuildings();
  };

  const filteredBuildings = buildings.filter(
    (building) =>
      building.buildingName.toLowerCase().includes(searchText.toLowerCase()) ||
      building.id.toString().includes(searchText)
  );

  const columns: ColumnsType<BuildingResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
          Building Name
        </div>
      ),
      dataIndex: "buildingName",
      key: "buildingName",
      sorter: (a, b) => a.buildingName.localeCompare(b.buildingName),
      render: (name: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-xs text-gray-500">Property</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          Total Floors
        </div>
      ),
      dataIndex: "totalFloor",
      key: "totalFloor",
      sorter: (a, b) => a.totalFloor - b.totalFloor,
      width: 160,
      render: (floors: number) => (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full border border-orange-300">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-orange-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="font-semibold text-orange-700 text-sm">
                {floors}
              </span>
              <span className="text-xs text-orange-600">floors</span>
            </div>
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
          <Tooltip title="Edit Building" placement="top">
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

          <Tooltip title="Delete Building" placement="top">
            <Button
              type="text"
              size="middle"
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
          title="Building Management"
          icon={
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
          }
          rightContent={
            <Space>
              <Input
                placeholder="Search buildings..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Building
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={filteredBuildings}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} buildings`,
          }}
          scroll={{ x: 50 }}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          locale={{
            emptyText: searchText
              ? `No buildings found matching "${searchText}"`
              : "No buildings available",
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/infrastructure/building/${record.id}`);
            },
          })}
        />
      </div>

      <BuildingAddOrUpdate
        visible={modalVisible}
        editingData={selectedBuilding}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Building"
        description={`Are you sure you want to delete "${selectedBuilding?.buildingName}"?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default BuildingList;
