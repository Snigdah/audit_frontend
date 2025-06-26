import { useEffect, useState } from "react";
import FloorService from "../../services/FloorService";
import type { FloorResponse } from "../../types/floor";
import { Card, Descriptions, Skeleton, Tag, Typography, Tooltip } from "antd";
import {
  ApartmentOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

const FloorDetails = ({ floorId }: { floorId: string }) => {
  const [floor, setFloor] = useState<FloorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFloor = async () => {
      try {
        const data = await FloorService.getFloorById(Number(floorId));
        setFloor(data);
      } catch (error) {
        console.error("Error fetching floor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloor();
  }, [floorId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!floor) {
    return <div className="p-4 text-red-500">Floor not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <ApartmentOutlined className="text-blue-500" />
            <span className="text-xl font-semibold">{floor.floorName}</span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Floor ID">
            <Text strong>{floor.id}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Floor Name">
            <Text>{floor.floorName}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Floor Level">
            <Tag color="blue" className="text-base">
              Level {floor.floorLevel}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Building Name">
            <Text>{floor.buildingName}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default FloorDetails;
