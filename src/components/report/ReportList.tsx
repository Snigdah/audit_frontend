import { useCallback, useEffect, useState } from "react";
import { Table, Input, Select, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import SectionHeader from "../common/SectionHeader";
import { useNavigate } from "react-router-dom";
import type { TemplateReportResponse } from "../../types/report";
import { ReportStatusEnum } from "../../types/report";
import { ReportService } from "../../services/ReportService";
import { debounce } from "lodash";

const ReportList = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState<TemplateReportResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [equipmentFilter, setEquipmentFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const fetchReports = useCallback(
    (page: number = currentPage, size: number = pageSize) => {
      setLoading(true);
      const params = {
        page: page - 1,
        size,
        ...(searchText?.trim() && { templateName: searchText.trim() }),
        ...(departmentFilter && { departmentName: departmentFilter }),
        ...(equipmentFilter && { equipmentName: equipmentFilter }),
        ...(statusFilter && { status: statusFilter }),
      };
      ReportService.fetchAllReports(params)
        .then((response) => {
          setReports(response.content ?? []);
          setTotalElements(response.pagination?.totalElements ?? 0);
        })
        .catch((err) => {
          console.error(err);
          message.error("Failed to fetch reports");
          setReports([]);
          setTotalElements(0);
        })
        .finally(() => setLoading(false));
    },
    [
      currentPage,
      pageSize,
      searchText,
      departmentFilter,
      equipmentFilter,
      statusFilter,
    ]
  );

  const debouncedFetch = useCallback(
    debounce(
      (
        templateName: string,
        dept?: string,
        equip?: string,
        status?: string
      ) => {
        setCurrentPage(1);
        setLoading(true);
        const params = {
          page: 0,
          size: pageSize,
          ...(templateName?.trim() && { templateName: templateName.trim() }),
          ...(dept && { departmentName: dept }),
          ...(equip && { equipmentName: equip }),
          ...(status && { status }),
        };
        ReportService.fetchAllReports(params)
          .then((response) => {
            setReports(response.content ?? []);
            setTotalElements(response.pagination?.totalElements ?? 0);
          })
          .catch((err) => {
            console.error(err);
            message.error("Failed to fetch reports");
            setReports([]);
            setTotalElements(0);
          })
          .finally(() => setLoading(false));
      },
      500
    ),
    [pageSize, departmentFilter, equipmentFilter, statusFilter]
  );

  useEffect(() => {
    fetchReports(1, pageSize);
  }, [departmentFilter, equipmentFilter, statusFilter]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedFetch(value, departmentFilter, equipmentFilter, statusFilter);
  };

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    const nextPage = pagination.current ?? currentPage;
    const nextSize = pagination.pageSize ?? pageSize;
    setCurrentPage(nextPage);
    setPageSize(nextSize);
    const params = {
      page: nextPage - 1,
      size: nextSize,
      ...(searchText?.trim() && { templateName: searchText.trim() }),
      ...(departmentFilter && { departmentName: departmentFilter }),
      ...(equipmentFilter && { equipmentName: equipmentFilter }),
      ...(statusFilter && { status: statusFilter }),
    };
    setLoading(true);
    ReportService.fetchAllReports(params)
      .then((response) => {
        setReports(response.content ?? []);
        setTotalElements(response.pagination?.totalElements ?? 0);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to fetch reports");
        setReports([]);
        setTotalElements(0);
      })
      .finally(() => setLoading(false));
  };

  const uniqueDepartments = [...new Set(reports.map((t) => t.departmentName))].filter(Boolean);
  const uniqueEquipment = [...new Set(reports.map((t) => t.equipmentName))].filter(Boolean);

  const getStatusConfig = (status: ReportStatusEnum | string) => {
    switch (status) {
      case ReportStatusEnum.Active:
        return { color: "green", label: ReportStatusEnum.Active };
      case ReportStatusEnum.Inactive:
        return { color: "default", label: ReportStatusEnum.Inactive };
      default:
        return { color: "default", label: String(status) };
    }
  };

  const columns: ColumnsType<TemplateReportResponse> = [
    {
      title: (
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          Report Name
        </div>
      ),
      dataIndex: "templateName",
      key: "templateName",
      sorter: (a, b) => a.templateName.localeCompare(b.templateName),
      render: (name: string, record: TemplateReportResponse) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">{name}</div>
          {record.description && (
            <div className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
          Department
        </div>
      ),
      dataIndex: "departmentName",
      key: "departmentName",
      sorter: (a, b) =>
        (a.departmentName ?? "").localeCompare(b.departmentName ?? ""),
      render: (dept: string) => (
        <span className="text-sm text-gray-700">{dept}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
          Equipment
        </div>
      ),
      dataIndex: "equipmentName",
      key: "equipmentName",
      sorter: (a, b) =>
        (a.equipmentName ?? "").localeCompare(b.equipmentName ?? ""),
      render: (equipment: string) => (
        <span className="text-sm text-gray-700">{equipment}</span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 text-sm">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 120,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: ReportStatusEnum) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} className="font-medium text-xs">
            {config.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <SectionHeader
          title="Reports"
          rightContent={
            <div className="flex flex-wrap lg:flex-nowrap gap-2">
              <Input
                placeholder="Search reports..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                value={searchText}
                onChange={handleSearchChange}
                className="w-full sm:w-48 lg:w-44 xl:w-52"
                size="middle"
              />

              <Select
                placeholder="Department"
                allowClear
                showSearch
                optionFilterProp="label"
                className="w-full sm:w-32 lg:w-32 xl:w-36"
                size="middle"
                value={departmentFilter}
                onChange={(value) => {
                  setDepartmentFilter(value);
                  setCurrentPage(1);
                }}
                onClear={() => setCurrentPage(1)}
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {uniqueDepartments.map((dept) => (
                  <Select.Option key={dept} value={dept} label={dept}>
                    {dept}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Equipment"
                allowClear
                showSearch
                optionFilterProp="label"
                className="w-full sm:w-32 lg:w-32 xl:w-36"
                size="middle"
                value={equipmentFilter}
                onChange={(value) => {
                  setEquipmentFilter(value);
                  setCurrentPage(1);
                }}
                onClear={() => setCurrentPage(1)}
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {uniqueEquipment.map((eq) => (
                  <Select.Option key={eq} value={eq} label={eq}>
                    {eq}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Status"
                allowClear
                className="w-full sm:w-28 lg:w-28 xl:w-32"
                size="middle"
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                onClear={() => setCurrentPage(1)}
              >
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </div>
          }
        />

        <Table
          dataSource={reports}
          columns={columns}
          rowKey="templateId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalElements,
            pageSizeOptions: ["10", "20", "50"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} reports`,
          }}
          scroll={{ x: 50 }}
          onChange={handleTableChange}
          bordered
          size="middle"
          className="shadow-sm cursor-pointer"
          locale={{
            emptyText: searchText
              ? `No reports found matching "${searchText}"`
              : "No reports available",
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/report/reports/${record.templateId}`);
            },
          })}
        />
      </div>
    </div>
  );
};

export default ReportList;
