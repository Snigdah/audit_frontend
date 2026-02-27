import { useEffect, useState, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const FloorList = ({ buildingId }: { buildingId: string }) => {
  const [floors, setFloors] = useState<FloorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<FloorResponse | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFloors = (
    page: number = 1,
    size: number = 10,
    search?: string
  ) => {
    setLoading(true);
    FloorService.getFloorsByBuildingId(Number(buildingId), {
      page: page - 1,
      size,
      search: search || undefined,
    })
      .then((data) => {
        setFloors(data.content ?? []);
        setTotalElements(data.pagination?.totalElements ?? 0);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch floors");
        setFloors([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFloors(currentPage, pageSize, searchText);
  }, [buildingId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      fetchFloors(1, pageSize, value);
    }, 500),
    [pageSize]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

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
        fetchFloors(currentPage, pageSize, searchText);
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
    fetchFloors(currentPage, pageSize, searchText);
  };

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
                onChange={handleSearchChange}
                allowClear
                className="w-64"
                value={searchText}
              />

              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Floor
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={floors}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} floors`,
          }}
          onChange={(pagination) => {
            const { current, pageSize: newPageSize } = pagination;
            if (current) setCurrentPage(current);
            if (newPageSize) setPageSize(newPageSize);
            fetchFloors(current || 1, newPageSize || 10, searchText);
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
