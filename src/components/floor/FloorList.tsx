import { useEffect, useState } from "react";
import { Button, Input, Space, Table, message, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FloorResponse } from "../../types/floor";
import FloorService from "../../services/FloorService";
import SectionHeader from "../common/SectionHeader";
import FloorAddOrUpdate from "./FloorAddOrUpdate";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import CustomButton from "../common/CustomButton";
import { Link, useNavigate } from "react-router-dom";

const FloorList = ({ buildingId }: { buildingId: string }) => {
  const [floors, setFloors] = useState<FloorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<FloorResponse | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFloors = () => {
    setLoading(true);
    FloorService.getFloorsByBuildingId(Number(buildingId))
      .then((res) => setFloors(res))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch floors");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFloors();
  }, [buildingId]);

  const handleAdd = () => {
    setSelectedFloor(null);
    setModalVisible(true);
  };

  const handleEdit = (record: FloorResponse) => {
    setSelectedFloor(record);
    setModalVisible(true);
  };

  const handleDeleteClick = (record: FloorResponse) => {
    setSelectedFloor(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFloor) return;
    setDeleteLoading(true);
    FloorService.deleteFloor(selectedFloor.id)
      .then(() => {
        message.success(
          `Floor "${selectedFloor.floorName}" deleted successfully`
        );
        fetchFloors();
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete floor");
      })
      .finally(() => setDeleteLoading(false));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedFloor(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchFloors();
  };

  const filteredFloors = floors.filter(
    (floor) =>
      floor.floorName.toLowerCase().includes(searchText.toLowerCase()) ||
      floor.id.toString().includes(searchText)
  );

  const columns: ColumnsType<FloorResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Floor Name
        </div>
      ),
      dataIndex: "floorName",
      key: "floorName",
      sorter: (a, b) => a.floorName.localeCompare(b.floorName),
      render: (text: string, record: FloorResponse) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm">{text}</div>
            <div className="text-xs text-gray-500 truncate">Floor</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          Floor Level
        </div>
      ),
      dataIndex: "floorLevel",
      key: "floorLevel",
      width: 160,
      sorter: (a, b) => a.floorLevel - b.floorLevel,
      render: (level: number) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full border border-amber-300 flex-shrink-0">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold text-amber-700 text-sm whitespace-nowrap">
                Level {level}
              </span>
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
          <Tooltip title="Edit Floor" placement="top">
            <Button
              type="text"
              size="small"
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

          <Tooltip title="Delete Floor" placement="top">
            <Button
              type="text"
              size="small"
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
          title="Floor Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search floors..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />

              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Floor
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={filteredFloors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} floors`,
          }}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No floors found matching "${searchText}"`
              : "No floors available",
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(
                `/infrastructure/building/${record.buildingId}/floor/${record.id}`
              );
            },
          })}
        />
      </div>

      <FloorAddOrUpdate
        visible={modalVisible}
        editingData={selectedFloor}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        buildingId={Number(buildingId)}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Floor"
        description={`Are you sure you want to delete "${selectedFloor?.floorName}"?`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default FloorList;
