import { useEffect, useState, useCallback } from "react";
import { Space, Table, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import OperatorService from "../../services/OperatorService";
import SectionHeader from "../common/SectionHeader";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import type { EquipmentResponse } from "../../types/equipment";

interface Props {
  operatorId: string;
}

const OperatorEquipments = ({ operatorId }: Props) => {
  const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  const fetchEquipments = (
    page: number = 1,
    size: number = 10,
    search?: string
  ) => {
    setLoading(true);
    OperatorService.getEquipmentsByOperator(Number(operatorId), {
      page: page - 1,
      size,
      search: search || undefined,
    })
      .then((data) => {
        setEquipments(data.content ?? []);
        setTotalElements(data.pagination?.totalElements ?? 0);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch equipments");
        setEquipments([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipments(currentPage, pageSize, searchText);
  }, [operatorId]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      fetchEquipments(1, pageSize, value);
    }, 500),
    [pageSize]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const columns: ColumnsType<EquipmentResponse> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
          Equipment Number
        </div>
      ),
      dataIndex: "equipmentNumber",
      key: "equipmentNumber",
      sorter: (a, b) => a.equipmentNumber.localeCompare(b.equipmentNumber),
      width: 180,
      render: (equipmentNumber: string) => (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full border border-slate-300">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span className="font-mono text-slate-700 text-sm font-semibold">
                {equipmentNumber}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
          Equipment Name
        </div>
      ),
      dataIndex: "equipmentName",
      key: "equipmentName",
      sorter: (a, b) => a.equipmentName.localeCompare(b.equipmentName),
      render: (equipmentName: string) => (
        <div className="flex items-center gap-3 min-w-[120px] whitespace-nowrap">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">
              {equipmentName}
            </div>
            <div className="text-xs text-gray-500">Equipment</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Equipment Management"
          rightContent={
            <Space>
              <Input
                placeholder="Search equipments..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                allowClear
                className="w-64"
                value={searchText}
              />
            </Space>
          }
        />

        <Table
          dataSource={equipments}
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
              `Showing ${range[0]}-${range[1]} of ${total} equipments`,
          }}
          onChange={(pagination) => {
            const { current, pageSize: newPageSize } = pagination;
            if (current) setCurrentPage(current);
            if (newPageSize) setPageSize(newPageSize);
            fetchEquipments(current || 1, newPageSize || 10, searchText);
          }}
          bordered
          size="middle"
          scroll={{ x: 50 }}
          locale={{
            emptyText: searchText
              ? `No equipments found matching "${searchText}"`
              : "No equipments assigned to this operator",
          }}
          onRow={(record) => ({
            onClick: () => navigate(`/infrastructure/equipment/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default OperatorEquipments;
