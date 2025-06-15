import { useEffect, useState } from "react";
import type { BuildingResponse } from "../../types/building";
import BuildingService from "../../services/BuildingService";
import type { ColumnsType } from "antd/es/table";
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
import { Link } from "react-router-dom";

const BuildingList = () => {
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] =
    useState<BuildingResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

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
        message.success(
          `Building "${selectedBuilding.buildingName}" deleted successfully`
        );
        fetchBuildings();
        setDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to delete building");
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
      title: "Building ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 120,
    },
    {
      title: "Building Name",
      dataIndex: "buildingName",
      key: "buildingName",
      sorter: (a, b) => a.buildingName.localeCompare(b.buildingName),
      render: (text, record) => (
        <Link
          to={`/infrastructure/building/${record.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Total Floors",
      dataIndex: "totalFloor",
      key: "totalFloor",
      sorter: (a, b) => a.totalFloor - b.totalFloor,
      width: 150,
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
            onClick={() => handleEdit(record)}
            className="text-primary-600 hover:bg-primary-50"
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            className="hover:bg-red-50"
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
          title="Building Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search buildings..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="bg-primary-600 hover:bg-primary-700"
              >
                Add Building
              </Button>
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
          scroll={{ x: 400 }}
          bordered
          size="middle"
          className="shadow-sm"
          locale={{
            emptyText: searchText
              ? `No buildings found matching "${searchText}"`
              : "No buildings available",
          }}
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
