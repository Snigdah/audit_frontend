import { useEffect, useState } from "react";
import BuildingService from "../../services/BuildingService";
import type { BuildingResponse } from "../../types/building";
import { Card, Descriptions, Skeleton, Tag, Typography, Tooltip } from "antd";
import {
  HomeOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

const BuildingDetails = ({ buildingId }: { buildingId: string }) => {
  const [building, setBuilding] = useState<BuildingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const data = await BuildingService.getBuildingById(Number(buildingId));
        setBuilding(data);
      } catch (error) {
        console.error("Error fetching building:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!building) {
    return <div className="p-4 text-red-500">Building not found</div>;
  }

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-blue-500" />
            <span className="text-xl font-semibold">
              {building.buildingName}
            </span>
          </div>
        }
        className="shadow-md rounded-lg border-0"
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Building ID">
            <Text strong>{building.id}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Total Floors">
            <Tag color="blue" className="text-base">
              {building.totalFloor} floors
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Last Modified">
            <div className="flex flex-wrap items-center gap-2">
              <FieldTimeOutlined className="text-gray-500 flex-shrink-0" />
              <Tooltip
                title={dayjs(building.lastModifiedTime).format(
                  "YYYY-MM-DD HH:mm"
                )}
                placement="bottom"
              >
                <Text className="whitespace-nowrap">
                  {dayjs(building.lastModifiedTime).fromNow()}
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
        </Descriptions>
      </Card>
    </div>
  );
};

export default BuildingDetails;
