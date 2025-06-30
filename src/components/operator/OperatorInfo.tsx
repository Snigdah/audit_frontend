import { useEffect, useState } from "react";
import { Card, Descriptions, Skeleton, Tag, Typography } from "antd";
import OperatorService from "../../services/OperatorService";
import type { OperatorDetail } from "../../types/operator";
import {
  IdcardOutlined,
  UserOutlined,
  UserSwitchOutlined,
  TagsOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const OperatorInfo = ({ operatorId }: { operatorId: string }) => {
  const [operator, setOperator] = useState<OperatorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperator = async () => {
      try {
        const data = await OperatorService.getOperatorById(Number(operatorId));
        setOperator(data);
      } catch (error) {
        console.error("Error fetching operator:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperator();
  }, [operatorId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!operator) {
    return <div className="p-4 text-red-500">Operator not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <UserOutlined className="text-green-600" />
            <span className="text-xl font-semibold">
              {operator.operatorName}
            </span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Operator ID">
            <Text strong>{operator.operatorId}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Employee ID">
            <Tag color="purple" className="text-base">
              {operator.employeeId}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Designation">
            <Tag color="blue" className="text-base">
              {operator.designationName}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Role">
            <Tag color="cyan" className="text-base font-medium">
              {operator.role}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OperatorInfo;
