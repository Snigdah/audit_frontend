import { useEffect, useState } from "react";
import { Card, Skeleton, Tag } from "antd";
import SupervisorService from "../../services/SupervisorService";
import type { SupervisorDetail } from "../../types/supervisor";
import {
  IdcardOutlined,
  UserOutlined,
  TagsOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SupervisorInfo = ({ supervisorId }: { supervisorId: string }) => {
  const [supervisor, setSupervisor] = useState<SupervisorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!supervisor) {
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
        <p className="text-red-600 text-sm font-medium m-0">Supervisor not found</p>
      </div>
    );
  }

  return (
    <Card
      className="shadow-sm border border-slate-200"
      styles={{ body: { padding: "20px" } }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5 cursor-pointer hover:bg-slate-50 transition-colors duration-200 p-2 rounded-md"
        onClick={() =>
          navigate("/user/profiles", { state: { employeeId: supervisor.employeeId } })
        }
      >
        <div className="bg-blue-900 p-2 rounded-md">
          <UserOutlined className="text-white text-base" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800 m-0">
            {supervisor.supervisorName}
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Supervisor Profile</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-3">

        {/* Supervisor ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2.5">
            <IdcardOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Supervisor ID</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {supervisor.supervisorId}
              </p>
            </div>
          </div>
        </div>

        {/* Employee ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2.5">
            <UserOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Employee ID</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {supervisor.employeeId}
              </p>
            </div>
          </div>
          <Tag color="blue" className="text-xs m-0">
            EMP
          </Tag>
        </div>

        {/* Designation */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-2.5">
            <TagsOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Designation</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {supervisor.designationName}
              </p>
            </div>
          </div>
        </div>

        {/* System Role */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-blue-50 rounded-md border border-blue-100">
          <div className="flex items-center gap-2.5">
            <StarOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">System Role</p>
              <p className="text-sm font-bold text-blue-900 m-0">
                {supervisor.role}
              </p>
            </div>
          </div>
          <Tag color="blue" className="text-xs font-medium m-0">
            Active
          </Tag>
        </div>

      </div>
    </Card>
  );
};

export default SupervisorInfo;
