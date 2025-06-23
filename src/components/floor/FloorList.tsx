import { useEffect, useState } from "react";
import { Button, Input, Space, Table, message } from "antd";
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
import { Link } from "react-router-dom";

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
      title: "Floor ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100,
    },
    {
      title: "Floor Name",
      dataIndex: "floorName",
      key: "floorName",
      sorter: (a, b) => a.floorName.localeCompare(b.floorName),
      render: (text, record) => (
        <Link
          to={`/infrastructure/building/${record.buildingId}/floor/${record.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {text}
        </Link>
      ),
    },

    {
      title: "Floor Level",
      dataIndex: "floorLevel",
      key: "floorLevel",
      sorter: (a, b) => a.floorLevel - b.floorLevel,
      width: 120,
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
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No floors found matching "${searchText}"`
              : "No floors available",
          }}
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
