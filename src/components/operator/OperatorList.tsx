import { useEffect, useState, useCallback } from "react";
import { Input, Space, Table, message, Button } from "antd";
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

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchOperators(searchValue);
    }, 500),
    []
  );

  const fetchOperators = (search?: string) => {
    setLoading(true);
    OperatorService.getAllOperators(search)
      .then((data) => setOperators(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch operators");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperators();
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
    // if (selectedOperatorId === null) return;
    // setDeleteLoading(true);
    // OperatorService.deleteOperator(selectedOperatorId)
    //   .then(() => {
    //     toast.warning("Operator deleted successfully");
    //     fetchOperators(searchText);
    //     setDeleteModalVisible(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(err.response?.data?.devMessage || "Failed to delete operator");
    //   })
    //   .finally(() => setDeleteLoading(false));
  };

  const columns: ColumnsType<OperatorSimple> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
    },
    {
      title: "Operator Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            className="text-primary-600 hover:bg-primary-50"
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(record);
            }}
            className="hover:bg-red-50"
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
