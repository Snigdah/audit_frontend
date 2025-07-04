import { useEffect, useState, useCallback } from "react";
import { Button, Input, Space, Table, message, Tooltip } from "antd";
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

  const designationColumns: ColumnsType<Designation> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Designation Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-xs text-gray-500">Position</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Actions
        </div>
      ),
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space size="small" className="flex justify-end">
          <Tooltip title="Edit Designation" placement="top">
            <Button
              type="text"
              size="middle"
              icon={
                <EditOutlined className="text-blue-600 hover:text-blue-700 transition-colors" />
              }
              onClick={() => handleEdit(record)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="text-blue-700 font-medium text-sm">Edit</span>
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
          title="Designation Management"
          icon={
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
          }
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
          columns={designationColumns}
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
