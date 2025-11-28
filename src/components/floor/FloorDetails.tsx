import { useEffect, useState } from "react";
import FloorService from "../../services/FloorService";
import type { FloorResponse } from "../../types/floor";
import { Card, Skeleton, Tag } from "antd";
import {
  ApartmentOutlined,
  NumberOutlined,
  HomeOutlined,
} from "@ant-design/icons";

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
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!floor) {
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
        <p className="text-red-600 text-sm font-medium m-0">Floor not found</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border border-slate-200" bodyStyle={{ padding: "20px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
        <div className="bg-blue-900 p-2 rounded-md">
          <ApartmentOutlined className="text-white text-base" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 m-0">
            {floor.floorName}
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Floor Details</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        {/* Floor ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <NumberOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Floor ID</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {floor.id}
              </p>
            </div>
          </div>
        </div>

        {/* Floor Level */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <ApartmentOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Floor Level</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                Level {floor.floorLevel}
              </p>
            </div>
          </div>
          <Tag color="blue" className="text-xs m-0">Level</Tag>
        </div>

        {/* Building Name */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <HomeOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Building Name</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {floor.buildingName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FloorDetails;
