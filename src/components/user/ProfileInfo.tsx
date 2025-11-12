import { useEffect, useState } from "react";
import { Spin, Card, Row, Col, Tag, Divider, Space } from "antd";
import { UserOutlined, IdcardOutlined, LockOutlined, ApartmentOutlined, SafetyOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ProfileService from "../../services/ProfileService";
import { toast } from "../common/Toast";
import SectionHeader from "../common/SectionHeader";
import CustomButton from "../common/CustomButton";

const ProfileInfo = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getBasicProfile();
      setProfile(data);
    } catch (err: any) {
      toast.error(err.response?.data?.devMessage || "Failed to load profile info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <Spin size="large" />
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500">No profile information found.</p>
      </div>
    );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <SectionHeader
        title="Profile Information"
        rightContent={
        <Space>
             
              <CustomButton  icon={<LockOutlined />}>
                Change Password
              </CustomButton>
            </Space>
        }
      />

      <Row gutter={[16, 16]}>
        {/* Personal Information Card */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
                <span>Personal Information</span>
              </div>
            }
            bordered
            className="shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserOutlined className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{profile.name || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IdcardOutlined className="text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                  <div className="inline-block px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-lg border border-cyan-300">
                    <span className="font-mono text-cyan-700 text-sm font-semibold">
                      #{profile.employeeId || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <SafetyOutlined className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Designation</p>
                  <p className="text-sm font-medium text-gray-900">{profile.designation || "-"}</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Role & Status Card */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <SafetyOutlined className="text-orange-600" />
                <span>Access & Status</span>
              </div>
            }
            bordered
            className="shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Role</p>
                <Tag color="orange" className="px-3 py-1 text-sm font-medium">
                  {profile.role || "No Role"}
                </Tag>
              </div>

              <Divider className="my-3" />

              <div>
                <p className="text-xs text-gray-500 mb-2">Account Status</p>
                {profile.isActive ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircleOutlined className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <CloseCircleOutlined className="text-red-600" />
                    <span className="text-sm font-medium text-red-700">Inactive</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Departments Card */}
        {profile.departments && profile.departments.length > 0 && (
          <Col xs={24}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ApartmentOutlined className="text-green-600" />
                  <span>Departments</span>
                </div>
              }
              bordered
              className="shadow-sm"
            >
              <div className="flex flex-wrap gap-2">
                {profile.departments.map((dept: any, index: number) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <ApartmentOutlined className="text-green-600 text-xs" />
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ProfileInfo;