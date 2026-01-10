import { useMemo, useState } from "react";
import { Table, Space, Input, Select, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SectionHeader from "../../components/common/SectionHeader";
import CustomButton from "../../components/common/CustomButton";
import { useNavigate } from "react-router-dom";

type TemplateRow = {
  id: number;
  name: string;
  department: string;
  equipment: string;
  status: "ACTIVE" | "INACTIVE";
};

const DUMMY_TEMPLATES: TemplateRow[] = [
  {
    id: 1,
    name: "Daily Safety Check",
    department: "Production",
    equipment: "Machine A",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Maintenance Report",
    department: "Maintenance",
    equipment: "Lift B",
    status: "ACTIVE",
  },
  {
    id: 3,
    name: "Quality Audit",
    department: "Quality",
    equipment: "Machine A",
    status: "INACTIVE",
  },
];

const TempletList = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [department, setDepartment] = useState<string | undefined>();
  const [equipment, setEquipment] = useState<string | undefined>();

  const filteredData = useMemo(() => {
    return DUMMY_TEMPLATES.filter((t) => {
      return (
        t.name.toLowerCase().includes(searchText.toLowerCase()) &&
        (!department || t.department === department) &&
        (!equipment || t.equipment === equipment)
      );
    });
  }, [searchText, department, equipment]);

  const columns: ColumnsType<TemplateRow> = [
    {
      title: "Template Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="font-semibold text-gray-800">{name}</div>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Equipment",
      dataIndex: "equipment",
      key: "equipment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "ACTIVE" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Templates"
          rightContent={
            <Space>
              <Input
                placeholder="Search template..."
                prefix={<SearchOutlined />}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-56"
              />

              {/* 🔍 Searchable Department */}
              <Select
                placeholder="Department"
                allowClear
                showSearch
                optionFilterProp="label"
                className="w-44"
                onChange={(value) => setDepartment(value)}
                filterOption={(input, option) =>
                String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="Production" label="Production">
                  Production
                </Select.Option>
                <Select.Option value="Maintenance" label="Maintenance">
                  Maintenance
                </Select.Option>
                <Select.Option value="Quality" label="Quality">
                  Quality
                </Select.Option>
              </Select>

              {/* 🔍 Searchable Equipment */}
              <Select
                placeholder="Equipment"
                allowClear
                showSearch
                optionFilterProp="label"
                className="w-44"
                onChange={(value) => setEquipment(value)}
                filterOption={(input, option) =>
                String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                <Select.Option value="Machine A" label="Machine A">
                  Machine A
                </Select.Option>
                <Select.Option value="Lift B" label="Lift B">
                  Lift B
                </Select.Option>
              </Select>

              <CustomButton
                icon={<PlusOutlined />}
                onClick={() => navigate("/template/create")}
              >
                Create Template
              </CustomButton>
            </Space>
          }
        />

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
          locale={{
            emptyText: "No templates found",
          }}
        />
      </div>
    </div>
  );
};

export default TempletList;
