import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Alert, Button, Spin } from "antd";
import {
  Building2,
  Cpu,
  FileStack,
  ClipboardList,
  GitPullRequest,
  CheckCircle2,
  Clock,
  XCircle,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  CalendarDays,
  CalendarOff,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { DashboardService } from "../../services/DashboardService";
import type { AdminDashboardResponse } from "../../types/dashboard";

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

function StatCard({
  label,
  value,
  icon: Icon,
  borderClass,
  iconWrapClass,
}: {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  borderClass: string;
  iconWrapClass: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm transition-all duration-200 hover:border-slate-200 hover:shadow-md sm:p-5 ${borderClass} border-l-[3px]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase leading-snug tracking-wide text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
            {formatCount(value)}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 sm:h-11 sm:w-11 ${iconWrapClass}`}
        >
          <Icon
            className="h-[18px] w-[18px] text-slate-700 sm:h-5 sm:w-5"
            strokeWidth={1.85}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {children}
      </h3>
      <div className="mt-1.5 h-px w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
    </div>
  );
}

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await DashboardService.getAdminDashboard();
      setData(res);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        (err as { response?: { data?: { devMessage?: string } } })?.response
          ?.data?.devMessage ?? "Failed to load admin dashboard";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="w-full max-w-[1600px]">
      <SectionHeader
        title="Admin overview"
        rightContent={
          <Button
            type="default"
            onClick={() => void load()}
            disabled={loading}
            icon={<RefreshCw className="h-4 w-4" />}
            className="flex items-center border-slate-200 text-slate-700 hover:!border-slate-300 hover:!text-slate-900"
          >
            Refresh
          </Button>
        }
      />

      <p className="-mt-2 mb-6 max-w-2xl text-sm leading-relaxed text-slate-600">
        Live snapshot of departments, equipment, reports, templates, and
        monthly submission activity across the platform.
      </p>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          className="mb-6 rounded-lg border-red-100"
        />
      )}

      <Spin spinning={loading} tip="Loading dashboard…">
        <div className="min-h-[240px] space-y-8 sm:space-y-10">
          <section>
            <SectionLabel>Active operations</SectionLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              <StatCard
                label="Active departments"
                value={data?.totalActiveDepartments}
                icon={Building2}
                borderClass="border-l-blue-500"
                iconWrapClass="bg-blue-50"
              />
              <StatCard
                label="Active equipment"
                value={data?.totalActiveEquipments}
                icon={Cpu}
                borderClass="border-l-cyan-500"
                iconWrapClass="bg-cyan-50"
              />
              <StatCard
                label="Active reports"
                value={data?.totalActiveReports}
                icon={FileStack}
                borderClass="border-l-indigo-500"
                iconWrapClass="bg-indigo-50"
              />
            </div>
          </section>

          <section>
            <SectionLabel>Templates & requests</SectionLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard
                label="Pending templates"
                value={data?.totalPendingTemplates}
                icon={ClipboardList}
                borderClass="border-l-amber-500"
                iconWrapClass="bg-amber-50"
              />
              <StatCard
                label="Pending structure changes"
                value={data?.totalPendingStructureChangeRequests}
                icon={GitPullRequest}
                borderClass="border-l-violet-500"
                iconWrapClass="bg-violet-50"
              />
              <StatCard
                label="Approved templates"
                value={data?.totalApprovedTemplate}
                icon={CheckCircle2}
                borderClass="border-l-emerald-500"
                iconWrapClass="bg-emerald-50"
              />
              <StatCard
                label="Pending template"
                value={data?.totalPendingTemplate}
                icon={Clock}
                borderClass="border-l-orange-500"
                iconWrapClass="bg-orange-50"
              />
              <StatCard
                label="Rejected templates"
                value={data?.totalRejectedTemplate}
                icon={XCircle}
                borderClass="border-l-rose-500"
                iconWrapClass="bg-rose-50"
              />
            </div>
          </section>

          <section>
            <SectionLabel>Monthly slots (submissions)</SectionLabel>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard
                label="Approved"
                value={data?.monthlySlotWithApprovedSubmission}
                icon={CalendarCheck}
                borderClass="border-l-emerald-600"
                iconWrapClass="bg-emerald-50/90"
              />
              <StatCard
                label="Rejected"
                value={data?.monthlySlotWithRejectedSubmission}
                icon={CalendarX}
                borderClass="border-l-rose-600"
                iconWrapClass="bg-rose-50/90"
              />
              <StatCard
                label="Pending"
                value={data?.monthlySlotWithPendingSubmission}
                icon={CalendarClock}
                borderClass="border-l-amber-600"
                iconWrapClass="bg-amber-50/90"
              />
              <StatCard
                label="Upcoming"
                value={data?.monthlySlotWithUpcomingSubmission}
                icon={CalendarDays}
                borderClass="border-l-sky-600"
                iconWrapClass="bg-sky-50/90"
              />
              <StatCard
                label="Missed"
                value={data?.monthlySlotWithMissedSubmission}
                icon={CalendarOff}
                borderClass="border-l-slate-600"
                iconWrapClass="bg-slate-100"
              />
            </div>
          </section>
        </div>
      </Spin>
    </div>
  );
};

export default AdminDashboard;
