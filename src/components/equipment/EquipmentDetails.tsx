import { useEffect, useState } from "react";
import EquipmentService from "../../services/EquipmentService";
import type { EquipmentResponse } from "../../types/equipment";
import { Card, Skeleton, Tag, Tooltip } from "antd";
import {
  ToolOutlined,
  NumberOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const EquipmentDetails = ({ equipmentId }: { equipmentId: string }) => {
  const [equipment, setEquipment] = useState<EquipmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await EquipmentService.getEquipmentById(Number(equipmentId));
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
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!equipment) {
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
        <p className="text-red-600 text-sm font-medium m-0">Equipment not found</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border border-slate-200" bodyStyle={{ padding: "20px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
        <div className="bg-blue-900 p-2 rounded-md">
          <ToolOutlined className="text-white text-base" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 m-0">
            {equipment.equipmentName}
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Equipment Details</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">
        {/* Equipment ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <NumberOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Equipment Name</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {equipment.equipmentName}
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Number */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <ToolOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Equipment Number</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {equipment.equipmentNumber}
              </p>
            </div>
          </div>
          <Tag color="purple" className="text-xs m-0">EQ</Tag>
        </div>

        {/* Last Modified */}
        {equipment.lastModifiedTime && (
          <div className="flex items-center justify-between py-2.5 px-3 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-center gap-2.5">
              <FieldTimeOutlined className="text-blue-900 text-sm" />
              <div>
                <p className="text-xs text-slate-500 m-0">Last Modified</p>

                <Tooltip
                  title={dayjs(equipment.lastModifiedTime).format("YYYY-MM-DD HH:mm")}
                >
                  <p className="text-sm font-semibold text-blue-900 m-0">
                    {dayjs(equipment.lastModifiedTime).fromNow()}
                  </p>
                </Tooltip>
              </div>
            </div>

            <Tag icon={<CheckCircleOutlined />} color="green" className="m-0">
              Updated
            </Tag>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EquipmentDetails;
