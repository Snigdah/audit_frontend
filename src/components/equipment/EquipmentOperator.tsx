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

  const fetchOperators = (search?: string) => {
    setLoading(true);
    EquipmentService.getOperatorsByEquipment(Number(equipmentId))
      .then((data) => {
        if (search) {
          const filtered = data.filter(
            (operator) =>
              operator.name.toLowerCase().includes(search.toLowerCase()) ||
              operator.employeeId.toLowerCase().includes(search.toLowerCase())
          );
          setOperators(filtered);
        } else {
          setOperators(data);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch operators");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperators();
  }, [equipmentId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      fetchOperators(value);
    }, 500),
    []
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
    fetchOperators();
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
      fetchOperators(searchText);
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
      title: "Operator ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Operator Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Remove Operator">
            <Button
              type="text"
              icon={
                <DeleteOutlined className="text-red-600 hover:text-red-700" />
              }
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(record.id);
              }}
            >
              <span className="text-red-700">Remove</span>
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
          title="Equipment Operator Management"
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
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} operators`,
          }}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No operators found matching "${searchText}"`
              : "No operators assigned to this equipment",
          }}
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
