import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import ViewerService from "../../services/ViewerService";
import SectionHeader from "../common/SectionHeader";
import type { ViewerSimple } from "../../types/viewer";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import ViewerAddModal from "./ViewerAddModal";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { toast } from "../common/Toast";
import AuthService from "../../services/AuthService";

const ViewerList = () => {
  const [viewers, setViewers] = useState<ViewerSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedViewerId, setSelectedViewerId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchViewers(searchValue);
    }, 500),
    []
  );

  const fetchViewers = (search?: string) => {
    setLoading(true);
    ViewerService.getAllViewers(search)
      .then((data) => setViewers(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch viewers");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchViewers();
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
    setSelectedViewerId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchViewers(searchText);
  };

  const handleDeleteClick = (record: ViewerSimple) => {
    setSelectedViewerId(record.id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedViewerId === null) return;

    setDeleteLoading(true);
    AuthService.deletUser({
      id: selectedViewerId,
      role: "READ_ONLY_USER",
    })
      .then(() => {
        toast.warning("Viewer deleted successfully");
        fetchViewers(searchText);
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.devMessage || "Failed to delete viewer");
      })
      .finally(() => setDeleteLoading(false));
  };

  const columns: ColumnsType<ViewerSimple> = [
  {
    title: (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Viewer ID
      </div>
    ),
    dataIndex: "employeeId",
    key: "employeeId",
    sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
    width: 160,
    render: (employeeId: string) => (
      <div className="flex items-center gap-2">
        <div className="px-2.5 py-1 bg-gradient-to-r from-green-100 to-green-200 rounded-lg border border-green-300">
          <span className="font-mono text-green-700 text-sm font-semibold">
            #{employeeId}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
        Role
      </div>
    ),
    key: "role",
    sorter: (a, b) => "Viewer".localeCompare("Viewer"), // Static sorter since all are viewers
    render: () => (
      <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
        <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="overflow-hidden text-ellipsis">
          <div className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
            Viewer
          </div>
          <div className="text-xs text-gray-500">Read Only</div>
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
    width: 120,
    render: (_, record) => (
      <Space size="small" className="flex justify-end">
        <Tooltip title="Delete Viewer" placement="top">
          <Button
            type="text"
            size="small"
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
          title="Viewer Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search by employee ID..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                value={searchText}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Viewer
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={viewers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} viewers`,
          }}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No viewers found matching "${searchText}"`
              : "No viewers available",
          }}
        //   onRow={(record) => ({
        //     onClick: () => navigate(`/resource/viewer/${record.id}`),
        //     style: { cursor: "pointer" },
        //   })}
          rowClassName={() => "hover:bg-gray-100"}
        />
      </div>

      <ViewerAddModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Viewer"
        description="Are you sure you want to delete this viewer?"
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default ViewerList;