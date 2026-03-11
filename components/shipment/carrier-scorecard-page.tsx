"use client"

import { CARRIER_SCORECARDS, type CarrierRating, type PerformanceTrend } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import { Award, TrendingUp, TrendingDown, Minus, Star, AlertTriangle, CheckCircle2 } from "lucide-react"

// ── Config ────────────────────────────────────────────────────────────────────

const RATING_CONFIG: Record<CarrierRating, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  preferred: { label: "Preferred",  color: "text-green-700 bg-green-50 border-green-200",  dot: "bg-green-500",  icon: <Star size={11} className="fill-green-600 text-green-600" /> },
  monitor:   { label: "Monitor",    color: "text-amber-700 bg-amber-50 border-amber-200",   dot: "bg-amber-500",  icon: <AlertTriangle size={11} className="text-amber-600" /> },
  caution:   { label: "Caution",    color: "text-red-700 bg-red-50 border-red-200",         dot: "bg-red-500",    icon: <AlertTriangle size={11} className="text-red-600" /> },
}

const TREND_CONFIG: Record<PerformanceTrend, { icon: React.ReactNode; label: string; color: string }> = {
  improving: { icon: <TrendingUp size={12} />,  label: "Improving", color: "text-green-600" },
  stable:    { icon: <Minus size={12} />,       label: "Stable",    color: "text-gray-500"  },
  declining: { icon: <TrendingDown size={12} />, label: "Declining", color: "text-red-600"  },
}

const OTP_COLORS = CARRIER_SCORECARDS.map((c) =>
  c.otpPercent >= 75 ? "#22c55e" : c.otpPercent >= 55 ? "#f59e0b" : "#ef4444"
)

// ── Summary stats ─────────────────────────────────────────────────────────────

const avgOTP = Math.round(
  CARRIER_SCORECARDS.reduce((sum, c) => sum + c.otpPercent, 0) / CARRIER_SCORECARDS.length
)
const totalActive = CARRIER_SCORECARDS.reduce((sum, c) => sum + c.activeShipments, 0)
const preferred = CARRIER_SCORECARDS.filter((c) => c.rating === "preferred").length
const caution   = CARRIER_SCORECARDS.filter((c) => c.rating === "caution").length

const chartData = [...CARRIER_SCORECARDS]
  .sort((a, b) => b.otpPercent - a.otpPercent)
  .map((c) => ({ name: c.carrier.split(" ")[0], otp: c.otpPercent }))

// ── Component ─────────────────────────────────────────────────────────────────

export function CarrierScorecardPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-6 max-w-[1200px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Award size={16} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Carrier Scorecards</h2>
            <p className="text-xs text-gray-400">On-time performance · Exception rates · Tracking compliance · {CARRIER_SCORECARDS.length} active carriers</p>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Fleet-Wide OTP",     value: `${avgOTP}%`,     sub: "On-time performance",    color: avgOTP >= 70 ? "text-green-600" : avgOTP >= 50 ? "text-amber-600" : "text-red-600" },
            { label: "Active Carriers",    value: CARRIER_SCORECARDS.length, sub: "Across all modes",    color: "text-gray-800" },
            { label: "Active Shipments",   value: totalActive,       sub: "Currently in transit",   color: "text-blue-700" },
            { label: "Preferred / Caution", value: `${preferred} / ${caution}`, sub: "Rating distribution", color: "text-gray-800" },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-[11px] text-gray-400 font-medium mb-1">{k.label}</p>
              <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
              <p className="text-[10px] text-gray-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* OTP chart + table */}
        <div className="grid grid-cols-3 gap-4">

          {/* OTP bar chart */}
          <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">OTP by Carrier (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  formatter={(v) => [`${v}%`, "OTP"]}
                  contentStyle={{ fontSize: 11 }}
                />
                <ReferenceLine x={75} stroke="#22c55e" strokeDasharray="4 2" strokeWidth={1} label={{ value: "Target 75%", position: "top", fontSize: 9, fill: "#16a34a" }} />
                <Bar dataKey="otp" radius={[0, 4, 4, 0]} maxBarSize={18}>
                  {chartData.map((_, i) => <Cell key={i} fill={OTP_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" /> ≥75% OTP</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> 55–74%</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> &lt;55%</span>
            </div>
          </div>

          {/* Carrier table */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Carrier", "Mode", "Shipments", "OTP %", "Avg Delay", "Exception Rate", "Tracking", "Trend", "Rating"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...CARRIER_SCORECARDS].sort((a, b) => b.otpPercent - a.otpPercent).map((c, i) => {
                  const rating = RATING_CONFIG[c.rating]
                  const trend  = TREND_CONFIG[c.trend]
                  return (
                    <tr key={c.carrier} className={cn("border-b border-gray-50", i % 2 === 0 ? "bg-white" : "bg-gray-50/30")}>
                      <td className="px-3 py-2.5 font-semibold text-gray-800">{c.carrier}</td>
                      <td className="px-3 py-2.5 text-gray-500">{c.modes.join(", ")}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{c.activeShipments}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", c.otpPercent >= 75 ? "bg-green-500" : c.otpPercent >= 55 ? "bg-amber-400" : "bg-red-500")}
                              style={{ width: `${c.otpPercent}%` }}
                            />
                          </div>
                          <span className={cn("font-semibold", c.otpPercent >= 75 ? "text-green-700" : c.otpPercent >= 55 ? "text-amber-700" : "text-red-700")}>
                            {c.otpPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("font-medium", c.avgDelayHours > 24 ? "text-red-600" : c.avgDelayHours > 12 ? "text-amber-600" : "text-gray-700")}>
                          +{c.avgDelayHours}h
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("font-medium", c.exceptionRate >= 80 ? "text-red-600" : c.exceptionRate >= 40 ? "text-amber-600" : "text-green-600")}>
                          {c.exceptionRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={11} className={c.trackingCompliance >= 95 ? "text-green-500" : "text-amber-500"} />
                          <span className="text-gray-600">{c.trackingCompliance}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("flex items-center gap-1", trend.color)}>
                          {trend.icon}
                          {trend.label}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5", rating.color)}>
                          {rating.icon} {rating.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lane coverage */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Carrier Lane Coverage</h3>
          <div className="flex flex-wrap gap-4">
            {CARRIER_SCORECARDS.map((c) => {
              const rating = RATING_CONFIG[c.rating]
              return (
                <div key={c.carrier} className="flex items-start gap-2">
                  <span className={cn("w-2 h-2 rounded-full mt-1 shrink-0", rating.dot)} />
                  <div>
                    <div className="text-xs font-medium text-gray-700">{c.carrier.split(" ")[0]}</div>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {c.lanes.map((l) => (
                        <span key={l} className="font-mono text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rating guide */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rating Methodology</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(RATING_CONFIG).map(([key, cfg]) => (
              <div key={key} className={cn("rounded-lg border p-3", cfg.color)}>
                <div className="flex items-center gap-1.5 mb-1">
                  {cfg.icon}
                  <span className="text-xs font-semibold">{cfg.label}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {key === "preferred" && "OTP ≥ 75% · Exception rate <35% · Tracking compliance >95% · Stable or improving trend"}
                  {key === "monitor"   && "OTP 55–74% · Exception rate 35–70% · Review for high-value lanes"}
                  {key === "caution"   && "OTP <55% · Declining trend or >70% exception rate · Consider alternate carrier"}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
