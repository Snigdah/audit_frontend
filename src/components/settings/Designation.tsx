import { useEffect, useState, useCallback } from "react";
import { Button, Input, Space, Table, message } from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DesignationService from "../../services/DesignationService";
import SectionHeader from "../common/SectionHeader";
import DesignationAddOrUpdate from "./DesignationAddOrUpdate";
import type { Designation } from "../../types/designation";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";

const DesignationList = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDesignation, setSelectedDesignation] =
    useState<Designation | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchDesignations(searchValue);
    }, 500),
    []
  );

  const fetchDesignations = (search?: string) => {
    setLoading(true);
    DesignationService.getDesignations(search)
      .then((data) => setDesignations(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch designations");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDesignations();
    // Cleanup debounce on unmount
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
    setSelectedDesignation(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Designation) => {
    setSelectedDesignation(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDesignation(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchDesignations(searchText); // Refresh with current search
  };

  const columns: ColumnsType<Designation> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 100,
    },
    {
      title: "Designation Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
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
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Designation Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search designations..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                value={searchText}
                allowClear
                className="w-64"
              />

              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Add Designation
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={designations}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} designations`,
          }}
          bordered
          size="middle"
          scroll={{ x: 400 }}
          locale={{
            emptyText: searchText
              ? `No designations found matching "${searchText}"`
              : "No designations available",
          }}
        />
      </div>

      <DesignationAddOrUpdate
        visible={modalVisible}
        editingData={selectedDesignation}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DesignationList;
