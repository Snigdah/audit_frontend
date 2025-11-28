import { useEffect, useState } from "react";
import BuildingService from "../../services/BuildingService";
import type { BuildingResponse } from "../../types/building";
import { Card, Skeleton, Tag, Tooltip } from "antd";
import {
  HomeOutlined,
  IdcardOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const BuildingDetails = ({ buildingId }: { buildingId: string }) => {
  const [building, setBuilding] = useState<BuildingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const data = await BuildingService.getBuildingById(Number(buildingId));
        setBuilding(data);
      } catch (error) {
        console.error("Error loading building:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [buildingId]);

  if (loading) return <Skeleton active paragraph={{ rows: 4 }} />;

  if (!building)
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
        <p className="text-red-600 text-sm font-medium m-0">
          Building not found
        </p>
      </div>
    );

  return (
    <Card className="shadow-sm border border-slate-200" bodyStyle={{ padding: "20px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
        <div className="bg-blue-900 p-2 rounded-md">
          <HomeOutlined className="text-white text-base" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 m-0">
            {building.buildingName}
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Building Profile</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-3">

        {/* Building ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <IdcardOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Building ID</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {building.id}
              </p>
            </div>
          </div>
        </div>

        {/* Total Floors */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <HomeOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Total Floors</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {building.totalFloor}
              </p>
            </div>
          </div>
          <Tag color="blue">FLOOR</Tag>
        </div>

        {/* Last Modified */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2.5">
            <FieldTimeOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Last Updated</p>
              <Tooltip
                title={dayjs(building.lastModifiedTime).format(
                  "YYYY-MM-DD HH:mm"
                )}
              >
                <p className="text-sm font-semibold text-blue-900 m-0">
                  {dayjs(building.lastModifiedTime).fromNow()}
                </p>
              </Tooltip>
            </div>
          </div>

          <Tag
            icon={<CheckCircleOutlined />}
            color="green"
            className="text-xs font-medium m-0"
          >
            Updated
          </Tag>
        </div>

      </div>
    </Card>
  );
};

export default BuildingDetails;
