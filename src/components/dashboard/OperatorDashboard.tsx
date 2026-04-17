import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  XCircle,
  CalendarClock,
  CalendarOff,
  RefreshCw,
  TrendingUp,
  Sparkles,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { DashboardService } from "../../services/DashboardService";
import type {
  OperatorDashboardResponse,
  OperatorReportDto,
} from "../../types/dashboard";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const n = (v: number | null | undefined): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : 0;

const fmt = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : v.toLocaleString();

function formatTime(hhmmss: string | null | undefined): string {
  if (!hhmmss) return "—";
  const [h, m] = hhmmss.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmmss;
  const hour = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Accent palette                                                     */
/* ------------------------------------------------------------------ */

type Accent =
  | "indigo"
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "slate";

const accentMap: Record<
  Accent,
  { icon: string; glow: string; bar: string; tag: string }
> = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    glow: "bg-indigo-500/10",
    bar: "from-indigo-500 to-indigo-400",
    tag: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    glow: "bg-cyan-500/10",
    bar: "from-cyan-500 to-cyan-400",
    tag: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    glow: "bg-violet-500/10",
    bar: "from-violet-500 to-violet-400",
    tag: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    glow: "bg-emerald-500/10",
    bar: "from-emerald-500 to-emerald-400",
    tag: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    glow: "bg-amber-500/10",
    bar: "from-amber-500 to-amber-400",
    tag: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    glow: "bg-rose-500/10",
    bar: "from-rose-500 to-rose-400",
    tag: "bg-rose-50 text-rose-700 ring-rose-100",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600 ring-sky-100",
    glow: "bg-sky-500/10",
    bar: "from-sky-500 to-sky-400",
    tag: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600 ring-slate-200",
    glow: "bg-slate-500/10",
    bar: "from-slate-500 to-slate-400",
    tag: "bg-slate-100 text-slate-700 ring-slate-200",
  },
};

/* ------------------------------------------------------------------ */
/*  KPI / mini-stat / eyebrow                                          */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  caption,
  tag,
}: {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  accent: Accent;
  caption?: string;
  tag?: string;
}) {
  const c = accentMap[accent];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(16,24,40,0.15)] sm:p-6">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${c.glow}`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${c.tag}`}
            >
              {tag ?? "Yours"}
            </span>
            {caption && (
              <span className="text-[11px] font-medium text-slate-500">
                {caption}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-4xl">
            {fmt(value)}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${c.icon}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
        </div>
      </div>
      <div
        className={`mt-5 h-1 w-full rounded-full bg-gradient-to-r ${c.bar} opacity-80`}
      />
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  accent: Accent;
}) {
  const c = accentMap[accent];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 transition-all hover:border-slate-200 hover:bg-white">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${c.icon}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="font-mono text-lg font-bold tabular-nums text-slate-900">
          {fmt(value)}
        </p>
      </div>
    </div>
  );
}

function Eyebrow({
  title,
  desc,
  right,
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          {title}
        </h3>
        {desc && (
          <p className="mt-0.5 text-xs text-slate-500 sm:text-[13px]">{desc}</p>
        )}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart palette + tooltip                                            */
/* ------------------------------------------------------------------ */

const COLORS = {
  approved: "#10b981",
  pending: "#f59e0b",
  rejected: "#f43f5e",
  upcoming: "#0ea5e9",
  missed: "#64748b",
};

type TipPayload = { name?: string; value?: number | string; color?: string };
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TipPayload[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
      {label !== undefined && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      )}
      <ul className="space-y-1">
        {payload.map((p, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-xs text-slate-700"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="font-medium">{p.name}</span>
            <span className="ml-auto font-mono font-semibold tabular-nums">
              {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status pill helper                                                 */
/* ------------------------------------------------------------------ */

function getStatusLook(status: string): {
  color: string;
  text: string;
  className: string;
} {
  const s = (status || "").toUpperCase();
  if (s === "APPROVED")
    return {
      color: "success",
      text: "Approved",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  if (s === "PENDING" || s === "NO_APPROVAL")
    return {
      color: "warning",
      text: s === "NO_APPROVAL" ? "No approval" : "Pending",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  if (s === "REJECTED" || s === "ALL_REJECTED")
    return {
      color: "error",
      text: s === "ALL_REJECTED" ? "All rejected" : "Rejected",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    };
  if (s === "UPCOMING" || s === "INCOMING")
    return {
      color: "processing",
      text: "Upcoming",
      className: "border-sky-200 bg-sky-50 text-sky-700",
    };
  if (s === "MISSED" || s === "NO_SUBMISSION")
    return {
      color: "default",
      text: s === "NO_SUBMISSION" ? "No submission" : "Missed",
      className: "border-slate-200 bg-slate-100 text-slate-700",
    };
  return {
    color: "default",
    text: status || "—",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

const OperatorDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<OperatorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // slots table state
  const [slots, setSlots] = useState<OperatorReportDto[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [page, setPage] = useState(1); // 1-based for AntD
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const loadOverview = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await DashboardService.getOperatorDashboard();
      setData(res);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        (err as { response?: { data?: { devMessage?: string } } })?.response
          ?.data?.devMessage ?? "Failed to load operator dashboard";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSlots = useCallback(
    async (p: number = page, s: number = pageSize) => {
      setSlotsLoading(true);
      try {
        const res = await DashboardService.getOperatorDashboardSlots({
          page: p - 1, // BE is 0-based
          size: s,
        });
        setSlots(res.content ?? []);
        setTotalElements(res.pagination?.totalElements ?? 0);
      } catch (err) {
        console.error(err);
        setSlots([]);
        setTotalElements(0);
      } finally {
        setSlotsLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    void loadSlots(page, pageSize);
  }, [loadSlots, page, pageSize]);

  const handleRefresh = () => {
    void loadOverview();
    void loadSlots(page, pageSize);
  };

  /* ---------- derived chart data ---------- */

  const todayPie = useMemo(
    () => [
      {
        name: "Approved",
        value: n(data?.todayAssignedDeptSlotApproved),
        color: COLORS.approved,
      },
      {
        name: "Pending",
        value: n(data?.todayAssignedDeptSlotPending),
        color: COLORS.pending,
      },
      {
        name: "Rejected",
        value: n(data?.todayAssignedDeptSlotRejected),
        color: COLORS.rejected,
      },
      {
        name: "Upcoming",
        value: n(data?.todayAssignedDeptSlotUpcoming),
        color: COLORS.upcoming,
      },
      {
        name: "Missed",
        value: n(data?.todayAssignedDeptSlotMissed),
        color: COLORS.missed,
      },
    ],
    [data]
  );
  const todayTotal = todayPie.reduce((a, b) => a + b.value, 0);

  const monthlyBars = useMemo(
    () => [
      {
        name: "Approved",
        value: n(data?.monthlyAssignedDeptSlotWithApprovedSubmission),
        fill: COLORS.approved,
      },
      {
        name: "Pending",
        value: n(data?.monthlyAssignedDeptSlotWithPendingSubmission),
        fill: COLORS.pending,
      },
      {
        name: "Rejected",
        value: n(data?.monthlyAssignedDeptWithRejectedSubmission),
        fill: COLORS.rejected,
      },
      {
        name: "Upcoming",
        value: n(data?.monthlyAssignedDeptSlotWithUpcomingSubmission),
        fill: COLORS.upcoming,
      },
      {
        name: "Missed",
        value: n(data?.monthlyAssignedDeptSlotWithMissedSubmission),
        fill: COLORS.missed,
      },
    ],
    [data]
  );
  const monthlyTotal = monthlyBars.reduce((a, b) => a + b.value, 0);

  const monthlyApprovalRate =
    monthlyTotal > 0
      ? Math.round(
          (n(data?.monthlyAssignedDeptSlotWithApprovedSubmission) /
            monthlyTotal) *
            100
        )
      : 0;

  /* ---------- table columns ---------- */

  const columns: ColumnsType<OperatorReportDto> = [
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <CalendarDays className="h-4 w-4 text-orange-500" />
          Date
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (date: string) => (
        <span className="text-sm font-medium text-slate-800">
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <Clock3 className="h-4 w-4 text-cyan-500" />
          Time
        </div>
      ),
      dataIndex: "time",
      key: "time",
      width: 120,
      render: (time: string) => (
        <span className="font-mono text-sm tabular-nums text-slate-700">
          {formatTime(time)}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <ClipboardList className="h-4 w-4 text-indigo-500" />
          Report
        </div>
      ),
      dataIndex: "reportName",
      key: "reportName",
      render: (name: string) => (
        <span className="text-sm font-semibold text-slate-900">
          {name || <span className="italic text-slate-400">Untitled</span>}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <Cpu className="h-4 w-4 text-violet-500" />
          Equipment
        </div>
      ),
      dataIndex: "equipmentName",
      key: "equipmentName",
      render: (name: string) => (
        <span className="text-sm text-slate-700">
          {name || <span className="italic text-slate-400">—</span>}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Status
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const look = getStatusLook(status);
        return (
          <Tag
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${look.className}`}
            color={look.color}
          >
            {look.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-[1600px]">
      {/* ============ HERO ============ */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-5 text-white shadow-sm sm:p-7">
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
                <Sparkles className="h-3 w-3" />
                Operator
              </span>
              <span className="text-[11px] font-medium text-white/60">
                Live snapshot
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-[26px]">
              My work overview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70 sm:text-[13.5px]">
              Your assigned equipment, today and this month’s submission
              activity, and slots waiting for action.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl bg-white/5 px-4 py-2 ring-1 ring-white/10 sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Monthly approval
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold tabular-nums">
                {monthlyApprovalRate}%
              </p>
            </div>
            <Button
              type="default"
              onClick={handleRefresh}
              disabled={loading || slotsLoading}
              icon={<RefreshCw className="h-4 w-4" />}
              className="flex items-center !border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ============ ERROR ============ */}
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          className="mb-6 rounded-lg border-red-100"
        />
      )}

      <Spin spinning={loading} tip="Loading dashboard…">
        <div className="min-h-[320px] space-y-6">
          {/* ============ KPI ROW ============ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Assigned equipment"
              value={data?.assignedEquipmentsCount}
              icon={Cpu}
              accent="cyan"
              caption="Devices you operate"
            />
            <KpiCard
              label="Pending submissions"
              value={data?.pendingSubmissionsCount}
              icon={Inbox}
              accent="amber"
              tag="Inbox"
              caption="Need your action"
            />
            <KpiCard
              label="Completed submissions"
              value={data?.completedSubmissionsCount}
              icon={CheckCircle2}
              accent="emerald"
              tag="Done"
              caption="Reviewed & accepted"
            />
            <KpiCard
              label="Missing slots"
              value={data?.missingSlotsCount}
              icon={AlertTriangle}
              accent="rose"
              tag="Attention"
              caption="Past with no submission"
            />
          </div>

          {/* ============ CHARTS ROW ============ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly bar - 2/3 */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 lg:col-span-2">
              <Eyebrow
                title="This month — assigned slots"
                desc="How your assigned-department slots are tracking this month."
                right={
                  <div className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200 sm:inline-flex">
                    <TrendingUp className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[11px] font-semibold text-slate-600">
                      Total&nbsp;
                      <span className="font-mono tabular-nums text-slate-900">
                        {fmt(monthlyTotal)}
                      </span>
                    </span>
                  </div>
                }
              />
              <div className="h-[260px] w-full sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyBars}
                    margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
                    barSize={38}
                  >
                    <defs>
                      {monthlyBars.map((s) => (
                        <linearGradient
                          id={`op-grad-${s.name}`}
                          key={s.name}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor={s.fill} stopOpacity={1} />
                          <stop
                            offset="100%"
                            stopColor={s.fill}
                            stopOpacity={0.55}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(15,23,42,0.04)" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {monthlyBars.map((s) => (
                        <Cell
                          key={s.name}
                          fill={`url(#op-grad-${s.name})`}
                          stroke={s.fill}
                          strokeWidth={0.5}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 sm:hidden">
                {monthlyBars.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-1.5 text-[11px] text-slate-600"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.fill }}
                    />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Today donut */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
              <Eyebrow
                title="Today's slot status"
                desc="Distribution of your slots for today."
                right={
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-700 ring-1 ring-cyan-100">
                    <CalendarDays className="h-3 w-3" />
                    Today
                  </span>
                }
              />
              <div className="relative h-[220px] w-full sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie
                      data={todayPie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {todayPie.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={28}
                      iconType="circle"
                      formatter={(v) => (
                        <span className="text-xs text-slate-600">{v}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Total
                  </p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-slate-900">
                    {fmt(todayTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {todayPie.map((p) => {
                  const pct =
                    todayTotal > 0
                      ? Math.round((p.value / todayTotal) * 100)
                      : 0;
                  return (
                    <div key={p.name} className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="flex-1 truncate text-sm text-slate-700">
                        {p.name}
                      </span>
                      <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                        {fmt(p.value)}
                      </span>
                      <span className="w-10 text-right font-mono text-xs tabular-nums text-slate-500">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============ TODAY MINI STATS ============ */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
            <Eyebrow
              title="Today at a glance"
              desc="Status counts for your assigned departments today."
            />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              <MiniStat
                label="Approved"
                value={data?.todayAssignedDeptSlotApproved}
                icon={CheckCircle2}
                accent="emerald"
              />
              <MiniStat
                label="Pending"
                value={data?.todayAssignedDeptSlotPending}
                icon={Clock3}
                accent="amber"
              />
              <MiniStat
                label="Rejected"
                value={data?.todayAssignedDeptSlotRejected}
                icon={XCircle}
                accent="rose"
              />
              <MiniStat
                label="Upcoming"
                value={data?.todayAssignedDeptSlotUpcoming}
                icon={CalendarClock}
                accent="sky"
              />
              <MiniStat
                label="Missed"
                value={data?.todayAssignedDeptSlotMissed}
                icon={CalendarOff}
                accent="slate"
              />
            </div>
          </div>

          {/* ============ MY SLOTS TABLE ============ */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
            <Eyebrow
              title="My slots"
              desc="Your upcoming and recent submission slots. Click a row to open the report."
              right={
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                  Total&nbsp;
                  <span className="font-mono tabular-nums text-slate-900">
                    {fmt(totalElements)}
                  </span>
                </span>
              }
            />
            <Table<OperatorReportDto>
              dataSource={slots}
              columns={columns}
              rowKey={(record, idx) =>
                `${record.reportId}-${record.date}-${record.time}-${idx ?? 0}`
              }
              loading={slotsLoading}
              pagination={{
                current: page,
                pageSize,
                total: totalElements,
                pageSizeOptions: ["10", "20", "50"],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} slots`,
              }}
              onChange={(p) => {
                if (p.current) setPage(p.current);
                if (p.pageSize) setPageSize(p.pageSize);
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (record.reportId) {
                    navigate(`/report/reports/${record.reportId}`);
                  }
                },
                className: "cursor-pointer",
              })}
              scroll={{ x: 700 }}
              size="middle"
              bordered
              className="rounded-lg"
              locale={{
                emptyText: (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                    <CalendarOff className="mb-2 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium">No slots assigned</p>
                    <p className="text-xs text-slate-400">
                      You’re all caught up — nothing is waiting right now.
                    </p>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default OperatorDashboard;
