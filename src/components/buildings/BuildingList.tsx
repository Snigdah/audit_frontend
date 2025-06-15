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
import { Table, Button, Space, Popconfirm, message, Input } from "antd";
import BuildingAddOrUpdate from "./BuildingAddOrUpdate ";

const BuildingList = () => {
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingBuilding, setEditingBuilding] =
    useState<BuildingResponse | null>(null);

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
    setEditingBuilding(null);
    setModalVisible(true);
  };

  const handleEdit = (record: BuildingResponse) => {
    setEditingBuilding(record);
    setModalVisible(true);
  };

  const handleDelete = (record: BuildingResponse) => {
    setLoading(true);
    BuildingService.deleteBuilding(record.id)
      .then(() => {
        message.success(
          `Building "${record.buildingName}" deleted successfully`
        );
        fetchBuildings();
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to delete building");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingBuilding(null);
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
          <Popconfirm
            title="Delete Building"
            description={`Are you sure to delete "${record.buildingName}"?`}
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
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
        editingData={editingBuilding}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default BuildingList;
