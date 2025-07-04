import { useEffect, useState } from "react";
import DepartmentService from "../../services/DepartmentService";
import type { DepartmentDetail } from "../../types/department";
import { Card, Descriptions, Skeleton, Tag, Typography } from "antd";
import { TeamOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DepartmentDetails = ({ departmentId }: { departmentId: string }) => {
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await DepartmentService.getDepartmentById(
          Number(departmentId)
        );
        setDepartment(data);
      } catch (error) {
        console.error("Error fetching department:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!department) {
    return <div className="p-4 text-red-500">Department not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined className="text-blue-500" />
            <span className="text-xl font-semibold">
              {department.departmentName}
            </span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item
            label="Department ID"
            styles={{ label: { width: "40%" }, content: { width: "60%" } }}
          >
            <Text strong>{department.departmentId}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label="Department Name"
            styles={{ label: { width: "40%" }, content: { width: "60%" } }}
          >
            <Tag color="geekblue" className="text-base">
              {department.departmentName}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label="Supervisors"
            styles={{ label: { width: "40%" }, content: { width: "60%" } }}
          >
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-gray-500" />
              <Tag color="green" className="text-base">
                {department.totalSupervisors}
              </Tag>
            </div>
          </Descriptions.Item>

          <Descriptions.Item
            label="Total Equipments"
            styles={{ label: { width: "40%" }, content: { width: "60%" } }}
          >
            <div className="flex items-center gap-2">
              <AppstoreOutlined className="text-gray-500" />
              <Tag color="purple" className="text-base">
                {department.totalEquipments}
              </Tag>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default DepartmentDetails;
