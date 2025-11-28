import { useEffect, useState } from "react";
import DepartmentService from "../../services/DepartmentService";
import type { DepartmentDetail } from "../../types/department";
import { Card, Skeleton, Tag } from "antd";
import {
  TeamOutlined,
  IdcardOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

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

  if (loading) return <Skeleton active paragraph={{ rows: 4 }} />;

  if (!department)
    return (
      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
        <p className="text-red-600 text-sm font-medium m-0">
          Department not found
        </p>
      </div>
    );

  return (
    <Card className="shadow-sm border border-slate-200" bodyStyle={{ padding: "20px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-5">
        <div className="bg-blue-900 p-2 rounded-md">
          <TeamOutlined className="text-white text-base" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 m-0">
            {department.departmentName}
          </h3>
          <p className="text-xs text-slate-500 m-0 mt-0.5">Department Profile</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-3">

        {/* Department ID */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <IdcardOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Department ID</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {department.departmentId}
              </p>
            </div>
          </div>
        </div>

        {/* Department Name */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <TeamOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Department Name</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {department.departmentName}
              </p>
            </div>
          </div>
          <Tag color="blue" className="text-xs m-0">
            DEPT
          </Tag>
        </div>

        {/* Supervisors */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <TeamOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Supervisors</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {department.totalSupervisors}
              </p>
            </div>
          </div>
          <Tag color="blue">SUP</Tag>
        </div>

        {/* Equipments */}
        <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
          <div className="flex items-center gap-2.5">
            <AppstoreOutlined className="text-blue-900 text-sm" />
            <div>
              <p className="text-xs text-slate-500 m-0">Total Equipments</p>
              <p className="text-sm font-semibold text-slate-800 m-0">
                {department.totalEquipments}
              </p>
            </div>
          </div>
          <Tag color="purple">EQ</Tag>
        </div>

      </div>
    </Card>
  );
};

export default DepartmentDetails;
