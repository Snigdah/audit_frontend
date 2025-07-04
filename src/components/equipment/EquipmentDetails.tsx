import { useEffect, useState } from "react";
import EquipmentService from "../../services/EquipmentService";
import type { EquipmentResponse } from "../../types/equipment";
import { Card, Descriptions, Skeleton, Tag, Typography, Tooltip } from "antd";
import {
  ToolOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

const EquipmentDetails = ({ equipmentId }: { equipmentId: string }) => {
  const [equipment, setEquipment] = useState<EquipmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await EquipmentService.getEquipmentById(
          Number(equipmentId)
        );
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [equipmentId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!equipment) {
    return <div className="p-4 text-red-500">Equipment not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <ToolOutlined className="text-blue-500" />
            <span className="text-xl font-semibold">
              {equipment.equipmentName}
            </span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Equipment ID">
            <Text strong>{equipment.id}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Equipment Name">
            <Tag color="geekblue" className="text-base">
              {equipment.equipmentName}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Equipment Number">
            <Tag color="purple" className="text-base">
              {equipment.equipmentNumber}
            </Tag>
          </Descriptions.Item>

          {equipment.lastModifiedTime && (
            <Descriptions.Item label="Last Modified">
              <div className="flex flex-wrap items-center gap-2">
                <FieldTimeOutlined className="text-gray-500 flex-shrink-0" />
                <Tooltip
                  title={dayjs(equipment.lastModifiedTime).format(
                    "YYYY-MM-DD HH:mm"
                  )}
                  placement="bottom"
                >
                  <Text className="whitespace-nowrap">
                    {dayjs(equipment.lastModifiedTime).fromNow()}
                  </Text>
                </Tooltip>
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="green"
                  className="flex-shrink-0"
                >
                  Updated
                </Tag>
              </div>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default EquipmentDetails;
