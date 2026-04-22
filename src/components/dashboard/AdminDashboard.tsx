import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Spin } from "antd";
import {
  Building2,
  Cpu,
  FileStack,
  ClipboardList,
  GitPullRequest,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  TrendingUp,
  Sparkles,
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
import type { AdminDashboardResponse } from "../../types/dashboard";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const n = (v: number | null | undefined): number =>
  typeof v === "number" && !Number.isNaN(v) ? v : 0;

const fmt = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : v.toLocaleString();

/* ------------------------------------------------------------------ */
/*  KPI card                                                           */
/* ------------------------------------------------------------------ */

type Accent = "indigo" | "cyan" | "violet" | "emerald" | "amber" | "rose";

const accentMap: Record<
  Accent,
  { ring: string; icon: string; glow: string; bar: string; tag: string }
> = {
  indigo: {
    ring: "from-indigo-500/20 to-indigo-500/0",
    icon: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    glow: "bg-indigo-500/10",
    bar: "from-indigo-500 to-indigo-400",
    tag: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  cyan: {
    ring: "from-cyan-500/20 to-cyan-500/0",
    icon: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    glow: "bg-cyan-500/10",
    bar: "from-cyan-500 to-cyan-400",
    tag: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  },
  violet: {
    ring: "from-violet-500/20 to-violet-500/0",
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    glow: "bg-violet-500/10",
    bar: "from-violet-500 to-violet-400",
    tag: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  emerald: {
    ring: "from-emerald-500/20 to-emerald-500/0",
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    glow: "bg-emerald-500/10",
    bar: "from-emerald-500 to-emerald-400",
    tag: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  amber: {
    ring: "from-amber-500/20 to-amber-500/0",
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    glow: "bg-amber-500/10",
    bar: "from-amber-500 to-amber-400",
    tag: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  rose: {
    ring: "from-rose-500/20 to-rose-500/0",
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    glow: "bg-rose-500/10",
    bar: "from-rose-500 to-rose-400",
    tag: "bg-rose-50 text-rose-700 ring-rose-100",
  },
};

function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
  caption,
}: {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  accent: Accent;
  caption?: string;
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
              Active
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

/* ------------------------------------------------------------------ */
/*  Pending pill (queue items)                                         */
/* ------------------------------------------------------------------ */

function QueueTile({
  label,
  value,
  icon: Icon,
  accent,
  hint,
}: {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  accent: Accent;
  hint: string;
}) {
  const c = accentMap[accent];
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm sm:p-5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${c.icon}`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.9} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-2xl font-bold tabular-nums text-slate-900">
          {fmt(value)}
        </p>
        <p className="mt-1 truncate text-[11px] text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section header                                                     */
/* ------------------------------------------------------------------ */

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

/* Custom tooltip - neutral, premium */
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
        (err as { response?: { data?: { userMessage?: string } } })?.response
          ?.data?.userMessage ?? "Failed to load admin dashboard";
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

  const templateTotal =
    n(data?.totalApprovedTemplate) +
    n(data?.totalPendingTemplate) +
    n(data?.totalRejectedTemplate);

  const templatePie = useMemo(
    () => [
      {
        name: "Approved",
        value: n(data?.totalApprovedTemplate),
        color: COLORS.approved,
      },
      {
        name: "Pending",
        value: n(data?.totalPendingTemplate),
        color: COLORS.pending,
      },
      {
        name: "Rejected",
        value: n(data?.totalRejectedTemplate),
        color: COLORS.rejected,
      },
    ],
    [data]
  );

  const slotBars = useMemo(
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

  const slotTotal = slotBars.reduce((a, b) => a + b.value, 0);

  const approvalRate =
    templateTotal > 0
      ? Math.round((n(data?.totalApprovedTemplate) / templateTotal) * 100)
      : 0;

  return (
    <div className="w-full max-w-[1600px]">
      {/* ============ HERO ============ */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-5 text-white shadow-sm sm:p-7">
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
                <Sparkles className="h-3 w-3" />
                Admin
              </span>
              <span className="text-[11px] font-medium text-white/60">
                Live snapshot
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl lg:text-[26px]">
              Operations overview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70 sm:text-[13.5px]">
              Real-time view of departments, equipment, reports, templates and
              this month’s submission activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-xl bg-white/5 px-4 py-2 ring-1 ring-white/10 sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Approval rate
              </p>
              <p className="mt-0.5 font-mono text-lg font-bold tabular-nums">
                {approvalRate}%
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <KpiCard
              label="Active departments"
              value={data?.totalActiveDepartments}
              icon={Building2}
              accent="indigo"
              caption="Currently operational"
            />
            <KpiCard
              label="Active equipment"
              value={data?.totalActiveEquipments}
              icon={Cpu}
              accent="cyan"
              caption="In use across plants"
            />
            <KpiCard
              label="Active reports"
              value={data?.totalActiveReports}
              icon={FileStack}
              accent="violet"
              caption="Running report configs"
            />
          </div>

          {/* ============ CHARTS ROW ============ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Monthly submissions - spans 2 */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 lg:col-span-2">
              <Eyebrow
                title="Monthly submission activity"
                desc="Slot distribution across statuses for the current month."
                right={
                  <div className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200 sm:inline-flex">
                    <TrendingUp className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[11px] font-semibold text-slate-600">
                      Total&nbsp;
                      <span className="font-mono tabular-nums text-slate-900">
                        {fmt(slotTotal)}
                      </span>
                    </span>
                  </div>
                }
              />
              <div className="h-[260px] w-full sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={slotBars}
                    margin={{ top: 16, right: 8, left: -16, bottom: 0 }}
                    barSize={38}
                  >
                    <defs>
                      {slotBars.map((s) => (
                        <linearGradient
                          id={`grad-${s.name}`}
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
                      {slotBars.map((s) => (
                        <Cell
                          key={s.name}
                          fill={`url(#grad-${s.name})`}
                          stroke={s.fill}
                          strokeWidth={0.5}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* compact legend for mobile */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 sm:hidden">
                {slotBars.map((s) => (
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

            {/* Template donut */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
              <Eyebrow
                title="Template status"
                desc="Share of templates by review state."
              />
              <div className="relative h-[220px] w-full sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie
                      data={templatePie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="90%"
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {templatePie.map((entry) => (
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
                {/* Center label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Total
                  </p>
                  <p className="font-mono text-2xl font-bold tabular-nums text-slate-900">
                    {fmt(templateTotal)}
                  </p>
                </div>
              </div>

              {/* Breakdown rows */}
              <div className="mt-4 space-y-2.5">
                {templatePie.map((p) => {
                  const pct =
                    templateTotal > 0
                      ? Math.round((p.value / templateTotal) * 100)
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

          {/* ============ QUEUE + SECONDARY METRICS ============ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Pending queue */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 lg:col-span-2">
              <Eyebrow
                title="Awaiting your review"
                desc="Items waiting for admin approval."
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <QueueTile
                  label="Pending template requests"
                  value={data?.totalPendingTemplates}
                  icon={ClipboardList}
                  accent="amber"
                  hint="New templates waiting for first approval."
                />
                <QueueTile
                  label="Pending structure changes"
                  value={data?.totalPendingStructureChangeRequests}
                  icon={GitPullRequest}
                  accent="violet"
                  hint="Supervisor-proposed changes pending review."
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
              <Eyebrow
                title="Template quick stats"
                desc="High-level outcome counts."
              />
              <ul className="space-y-3">
                <QuickRow
                  icon={CheckCircle2}
                  tone="emerald"
                  label="Approved"
                  value={data?.totalApprovedTemplate}
                />
                <QuickRow
                  icon={Clock3}
                  tone="amber"
                  label="Pending"
                  value={data?.totalPendingTemplate}
                />
                <QuickRow
                  icon={XCircle}
                  tone="rose"
                  label="Rejected"
                  value={data?.totalRejectedTemplate}
                />
              </ul>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Quick row (small list item)                                        */
/* ------------------------------------------------------------------ */

function QuickRow({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: LucideIcon;
  tone: Accent;
  label: string;
  value: number | null | undefined;
}) {
  const c = accentMap[tone];
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${c.icon}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </span>
      <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
      <span className="font-mono text-sm font-bold tabular-nums text-slate-900">
        {fmt(value)}
      </span>
    </li>
  );
}

export default AdminDashboard;
