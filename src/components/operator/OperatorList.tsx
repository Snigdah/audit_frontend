import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import OperatorService from "../../services/OperatorService";
import SectionHeader from "../common/SectionHeader";
import type { OperatorSimple } from "../../types/operator";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import OperatorAddModal from "./OperatorAddModal";
import OperatorUpdateModal from "./OperatorUpdateModal";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { toast } from "../common/Toast";
import AuthService from "../../services/AuthService";

const OperatorList = () => {
  const [operators, setOperators] = useState<OperatorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchOperators(searchValue);
    }, 500),
    []
  );

  const fetchOperators = (
    search?: string,
    page: number = currentPage - 1, // Convert to 0-based for API
    size: number = pageSize
  ) => {
    setLoading(true);
    OperatorService.getAllOperators({
      search,
      page,
      size,
      all: false,
    })
      .then((response) => {
        setOperators(response.content);
         if (response.pagination) {
          setTotalElements(response.pagination.totalElements);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch operators");
        setOperators([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperators();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

    // Handle table pagination change
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
    fetchOperators(searchText, current - 1, pageSize);
  };

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
    setUpdateModalVisible(false);
    setSelectedOperatorId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchOperators(searchText);
  };

  const handleEdit = (record: OperatorSimple) => {
    setSelectedOperatorId(record.id);
    setUpdateModalVisible(true);
  };

  const handleDeleteClick = (record: OperatorSimple) => {
    setSelectedOperatorId(record.id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedOperatorId === null) return;

    setDeleteLoading(true);
    AuthService.deletUser({
      id: selectedOperatorId,
      role: "OPERATOR",
    })
      .then(() => {
        toast.warning("Operator deleted successfully");
        fetchOperators(searchText);
        setDeleteModalVisible(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.devMessage || "Failed to delete operator");
      })
      .finally(() => setDeleteLoading(false));
  };

  const columns: ColumnsType<OperatorSimple> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
          Employee ID
        </div>
      ),
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
      width: 160,
      render: (employeeId: string) => (
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-lg border border-cyan-300">
            <span className="font-mono text-cyan-700 text-sm font-semibold">
              #{employeeId}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          Operator Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="overflow-hidden text-ellipsis">
            <div className="font-semibold text-gray-900 text-sm truncate max-w-[140px]">
              {name}
            </div>
            <div className="text-xs text-gray-500">Operator</div>
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
          <Tooltip title="Edit Operator" placement="top">
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

          <Tooltip title="Delete Operator" placement="top">
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
          title="Operator Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search operators..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                value={searchText}
                allowClear
                className="w-64"
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Operator
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={operators}
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
              `Showing ${range[0]}-${range[1]} of ${total} supervisors`,
          }}
          onChange={handleTableChange}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No operators found matching "${searchText}"`
              : "No operators available",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/resource/operator/${record.id}`),
            style: { cursor: "pointer" },
          })}
          rowClassName={() => "hover:bg-gray-100"}
        />
      </div>

      <OperatorAddModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <OperatorUpdateModal
        visible={updateModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        operatorId={selectedOperatorId}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Operator"
        description="Are you sure you want to delete this operator?"
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default OperatorList;
