import { useEffect, useState } from "react";
import { Card, Descriptions, Skeleton, Tag, Typography } from "antd";
import SupervisorService from "../../services/SupervisorService";
import type { SupervisorDetail } from "../../types/supervisor";
import {
  IdcardOutlined,
  UserOutlined,
  UserSwitchOutlined,
  TagsOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const SupervisorInfo = ({ supervisorId }: { supervisorId: string }) => {
  const [supervisor, setSupervisor] = useState<SupervisorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        const data = await SupervisorService.getSupervisorById(
          Number(supervisorId)
        );
        setSupervisor(data);
      } catch (error) {
        console.error("Error fetching supervisor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisor();
  }, [supervisorId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!supervisor) {
    return <div className="p-4 text-red-500">Supervisor not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <UserOutlined className="text-green-600" />
            <span className="text-xl font-semibold">
              {supervisor.supervisorName}
            </span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Supervisor ID">
            <Text strong>{supervisor.supervisorId}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Employee ID">
            <Tag color="purple" className="text-base">
              {supervisor.employeeId}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Designation">
            <Tag color="blue" className="text-base">
              {supervisor.designationName}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Role">
            <Tag color="cyan" className="text-base font-medium">
              {supervisor.role}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default SupervisorInfo;
