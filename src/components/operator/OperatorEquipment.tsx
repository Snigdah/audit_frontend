import { useEffect, useState } from "react";
import type { EquipmentResponse } from "../../types/equipment";
import OperatorService from "../../services/OperatorService";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import { Table, Input, Space, message } from "antd";
import { useNavigate } from "react-router-dom";

const OperatorEquipment = ({ operatorId }: { operatorId: string }) => {
  const [equipment, setEquipment] = useState<EquipmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  const fetchEquipment = () => {
    setLoading(true);
    OperatorService.getEquipmentsByOperatorId(Number(operatorId))
      .then((res) => setEquipment(res))
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch equipment");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipment();
  }, [operatorId]);

  const filteredEquipment = equipment.filter(
    (item) =>
      item.equipmentName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.equipmentNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toString().includes(searchText)
  );

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
          title="Operator's Equipment"
          icon={
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          }
          rightContent={
            <Space>
              <Input
                placeholder="Search equipment..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="w-64"
              />
            </Space>
          }
        />

        <Table
          dataSource={filteredEquipment}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} equipment`,
          }}
          scroll={{ x: 50 }}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          onRow={(record) => ({
            onClick: () => {
              navigate(`/infrastructure/equipment/${record.id}`);
            },
          })}
          rowClassName={() => "hover:bg-gray-100"}
          locale={{
            emptyText: searchText
              ? `No equipment found matching "${searchText}"`
              : "No equipment available",
          }}
        />
      </div>
    </div>
  );
};

export default OperatorEquipment;
