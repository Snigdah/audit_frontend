import { useEffect, useState, useCallback } from "react";
import { Space, Table, Button, Tooltip, message, Input } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import EquipmentService from "../../services/EquipmentService";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import type { OperatorSimple } from "../../types/operator";
import EquipmentOperatorAddModal from "./EquipmentOperatorAddModal";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

interface Props {
  equipmentId: string;
}

const EquipmentOperator = ({ equipmentId }: Props) => {
  const [operators, setOperators] = useState<OperatorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const fetchOperators = (
    page: number = 1,
    size: number = 10,
    search?: string
  ) => {
    setLoading(true);
    EquipmentService.getOperatorsByEquipment(Number(equipmentId), {
      page: page - 1,
      size,
      search: search || undefined,
    })
      .then((data) => {
        setOperators(data.content ?? []);
        setTotalElements(data.pagination?.totalElements ?? 0);
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
    fetchOperators(currentPage, pageSize, searchText);
  }, [equipmentId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      fetchOperators(1, pageSize, value);
    }, 500),
    [pageSize]
  );

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
    setSelectedOperatorId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchOperators(currentPage, pageSize, searchText);
  };

  const handleDeleteClick = (operatorId: number) => {
    setSelectedOperatorId(operatorId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOperatorId) return;

    try {
      await EquipmentService.removeOperator({
        equipmentId: Number(equipmentId),
        operatorId: selectedOperatorId,
      });
      toast.warning("Operator removed successfully");
      fetchOperators(currentPage, pageSize, searchText);
      setDeleteModalVisible(false);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.devMessage || "Failed to remove operator"
      );
    }
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
      width: 140,
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
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
      width: 150,
      render: (_, record) => (
        <Space size="small" className="flex justify-end">
          <Tooltip title="Remove Operator" placement="top">
            <Button
              type="text"
              size="small"
              icon={
                <DeleteOutlined className="text-red-600 hover:text-red-700 transition-colors" />
              }
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(record.id);
              }}
            >
              <span className="text-red-700 font-medium text-sm">Remove</span>
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
                allowClear
                className="w-64"
                value={searchText}
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Assign Operator
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
            pageSize,
            total: totalElements,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} operators`,
          }}
          onChange={(pagination) => {
            const { current, pageSize: newPageSize } = pagination;
            if (current) setCurrentPage(current);
            if (newPageSize) setPageSize(newPageSize);
            fetchOperators(current || 1, newPageSize || 10, searchText);
          }}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No operators found matching "${searchText}"`
              : "No operators assigned to this equipment",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/resource/operator/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <EquipmentOperatorAddModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        equipmentId={Number(equipmentId)}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Operator"
        description="Are you sure you want to remove this operator from the equipment?"
        confirmText="Remove"
      />
    </div>
  );
};

export default EquipmentOperator;
