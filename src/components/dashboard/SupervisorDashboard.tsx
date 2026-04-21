import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Spin } from "antd";
import {
  Building2,
  Cpu,
  FileStack,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  CalendarClock,
  CalendarOff,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Inbox,
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
  LineChart,
  Line,
} from "recharts";
import { DashboardService } from "../../services/DashboardService";
import type { SupervisorDashboardResponse } from "../../types/dashboard";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const n = (v: number | null | undefined): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : 0;

const fmt = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : v.toLocaleString();

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
/*  Cards                                                              */
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
              {tag ?? "Assigned"}
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
/*  Chart palette                                                      */
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
/*  Main                                                               */
/* ------------------------------------------------------------------ */

const SupervisorDashboard = () => {
  const [data, setData] = useState<SupervisorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await DashboardService.getSupervisorDashboard();
      setData(res);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        (err as { response?: { data?: { userMessage?: string } } })?.response
          ?.data?.userMessage ?? "Failed to load supervisor dashboard";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* ---------- derived chart data ---------- */

  const todayPie = useMemo(
    () => [
      {
        name: "Approved",
        value: n(data?.todaySlotCountApprovedSubmission),
        color: COLORS.approved,
      },
      {
        name: "Pending",
        value: n(data?.todaySlotCountPendingSubmission),
        color: COLORS.pending,
      },
      {
        name: "Rejected",
        value: n(data?.todaySlotCountAllRejectedSubmission),
        color: COLORS.rejected,
      },
      {
        name: "Upcoming",
        value: n(data?.todaySlotCountUpcomingSubmission),
        color: COLORS.upcoming,
      },
      {
        name: "Missed",
        value: n(data?.todaySlotCountMissedSubmission),
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
        value: n(data?.monthlySlotWithApprovedSubmission),
        fill: COLORS.approved,
      },
      {
        name: "Pending",
        value: n(data?.monthlySlotWithPendingSubmission),
        fill: COLORS.pending,
      },
      {
        name: "Rejected",
        value: n(data?.monthlySlotWithRejectedSubmission),
        fill: COLORS.rejected,
      },
      {
        name: "Upcoming",
        value: n(data?.monthlySlotWithUpcomingSubmission),
        fill: COLORS.upcoming,
      },
      {
        name: "Missed",
        value: n(data?.monthlySlotWithMissedSubmission),
        fill: COLORS.missed,
      },
    ],
    [data]
  );
  const monthlyTotal = monthlyBars.reduce((a, b) => a + b.value, 0);

  // today-vs-month comparison line per status
  const compareLine = useMemo(
    () => [
      {
        status: "Approved",
        Today: n(data?.todaySlotCountApprovedSubmission),
        Month: n(data?.monthlySlotWithApprovedSubmission),
      },
      {
        status: "Pending",
        Today: n(data?.todaySlotCountPendingSubmission),
        Month: n(data?.monthlySlotWithPendingSubmission),
      },
      {
        status: "Rejected",
        Today: n(data?.todaySlotCountAllRejectedSubmission),
        Month: n(data?.monthlySlotWithRejectedSubmission),
      },
      {
        status: "Upcoming",
        Today: n(data?.todaySlotCountUpcomingSubmission),
        Month: n(data?.monthlySlotWithUpcomingSubmission),
      },
      {
        status: "Missed",
        Today: n(data?.todaySlotCountMissedSubmission),
        Month: n(data?.monthlySlotWithMissedSubmission),
      },
    ],
    [data]
  );

  const monthlyApprovalRate =
    monthlyTotal > 0
      ? Math.round(
          (n(data?.monthlySlotWithApprovedSubmission) / monthlyTotal) * 100
        )
      : 0;

  return (
    <div className="w-full max-w-[1600px]">
      {/* ============ HERO ============ */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-5 text-white shadow-sm sm:p-7">
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
                <Sparkles className="h-3 w-3" />
                Supervisor
              </span>
              <span className="text-[11px] font-medium text-white/60">
                Live snapshot
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-[26px]">
              Floor &amp; submission overview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70 sm:text-[13.5px]">
              Your assigned departments, equipment, and how today and this
              month’s submissions are tracking.
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
              onClick={() => void load()}
              disabled={loading}
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
              label="Assigned departments"
              value={data?.assignedDepartmentsCount}
              icon={Building2}
              accent="indigo"
              caption="Under your supervision"
            />
            <KpiCard
              label="Assigned equipment"
              value={data?.assignedEquipmentsCount}
              icon={Cpu}
              accent="cyan"
              caption="Across your departments"
            />
            <KpiCard
              label="Total reports"
              value={data?.totalReportsCount}
              icon={FileStack}
              accent="violet"
              caption="Configured for you"
            />
            <KpiCard
              label="Pending review"
              value={data?.totalPendingSubmissionCount}
              icon={Inbox}
              accent="amber"
              tag="Inbox"
              caption="Awaiting your action"
            />
          </div>

          {/* ============ CHARTS ROW ============ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly bar - 2/3 */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 lg:col-span-2">
              <Eyebrow
                title="This month — submission activity"
                desc="Slot distribution across statuses for the current month."
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
                          id={`sup-grad-${s.name}`}
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
                          fill={`url(#sup-grad-${s.name})`}
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
                desc="How today's submission slots are distributed."
                right={
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
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

          {/* ============ TODAY MINI STATS + COMPARE LINE ============ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Today mini stats */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
              <Eyebrow
                title="Today at a glance"
                desc="Current-day slot counts."
              />
              <div className="grid grid-cols-1 gap-2.5">
                <MiniStat
                  label="Approved"
                  value={data?.todaySlotCountApprovedSubmission}
                  icon={CheckCircle2}
                  accent="emerald"
                />
                <MiniStat
                  label="Pending"
                  value={data?.todaySlotCountPendingSubmission}
                  icon={Clock3}
                  accent="amber"
                />
                <MiniStat
                  label="Rejected"
                  value={data?.todaySlotCountAllRejectedSubmission}
                  icon={XCircle}
                  accent="rose"
                />
                <MiniStat
                  label="Upcoming"
                  value={data?.todaySlotCountUpcomingSubmission}
                  icon={CalendarClock}
                  accent="sky"
                />
                <MiniStat
                  label="Missed"
                  value={data?.todaySlotCountMissedSubmission}
                  icon={CalendarOff}
                  accent="slate"
                />
              </div>
            </div>

            {/* Today vs Month line */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 lg:col-span-2">
              <Eyebrow
                title="Today vs this month"
                desc="Compare each status: today’s count against the month total."
              />
              <div className="h-[260px] w-full sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={compareLine}
                    margin={{ top: 16, right: 16, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="sup-line-month"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <XAxis
                      dataKey="status"
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
                      cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={28}
                      iconType="circle"
                      formatter={(v) => (
                        <span className="text-xs text-slate-600">{v}</span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="Month"
                      stroke="url(#sup-line-month)"
                      strokeWidth={2.5}
                      dot={{ r: 4, stroke: "#6366f1", strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Today"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default SupervisorDashboard;
