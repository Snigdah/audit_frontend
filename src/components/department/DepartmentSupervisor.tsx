import { useEffect, useState, useCallback } from "react";
import { Space, Table, Button, Tooltip, message, Input } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DepartmentService from "../../services/DepartmentService";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { debounce } from "lodash";

import type { SupervisorSimple } from "../../types/supervisor";
import DepartmentSupervisorAddModal from "./DepartmentSupervisorAddModal ";
import { useNavigate } from "react-router-dom";

interface Props {
  departmentId: string;
}

const DepartmentSupervisor = ({ departmentId }: Props) => {
  const [supervisors, setSupervisors] = useState<SupervisorSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<
    number | null
  >(null);
  const [searchText, setSearchText] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchSupervisors(searchValue);
    }, 500),
    []
  );

  const fetchSupervisors = (
    search?: string,
    page: number = currentPage - 1, // Convert to 0-based for API
    size: number = pageSize
  ) => {
    setLoading(true);
    DepartmentService.getSupervisorsByDepartment(Number(departmentId), {
      search,
      page,
      size,
      all: false,
    })
      .then((response) => {
        setSupervisors(response.content);
         if (response.pagination) {
          setTotalElements(response.pagination.totalElements);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch supervisors");
        setSupervisors([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSupervisors(searchText);
    return () => {
      debouncedSearch.cancel();
    };
  }, [departmentId]);

  // Handle table pagination change
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setCurrentPage(current);
    setPageSize(pageSize);
    fetchSupervisors(searchText, current - 1, pageSize);
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
    setSelectedSupervisorId(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchSupervisors();
  };

  const handleDeleteClick = (supervisorId: number) => {
    setSelectedSupervisorId(supervisorId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSupervisorId) return;

    try {
      await DepartmentService.removeSupervisor({
        departmentId: Number(departmentId),
        supervisorId: selectedSupervisorId,
      });
      toast.warning("Supervisor removed successfully");
      fetchSupervisors(searchText);
      setDeleteModalVisible(false);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.devMessage || "Failed to remove supervisor"
      );
    }
  };

  const columns: ColumnsType<SupervisorSimple> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Employee ID
        </div>
      ),
      dataIndex: "employeeId",
      key: "employeeId",
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
      width: 140,
      render: (employeeId: string) => (
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
            <span className="font-mono text-blue-700 text-sm font-semibold">
              #{employeeId}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Supervisor Name
        </div>
      ),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013-3.006z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-xs text-gray-500">Supervisor</div>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small" className="flex justify-end">
          <Tooltip title="Remove Supervisor" placement="top">
            <Button
              type="text"
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
          title="Supervisor Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search supervisors..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                allowClear
                className="w-64"
                value={searchText}
              />
              <CustomButton onClick={handleAdd} icon={<PlusOutlined />}>
                Assign Supervisor
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={supervisors}
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
              ? `No supervisors found matching "${searchText}"`
              : "No supervisors assigned to this department",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/resource/supervisor/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <DepartmentSupervisorAddModal
        visible={addModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        departmentId={Number(departmentId)}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Supervisor"
        description="Are you sure you want to remove this supervisor from the department?"
        confirmText="Remove"
      />
    </div>
  );
};

export default DepartmentSupervisor;
