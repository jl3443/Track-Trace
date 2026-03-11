"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard, BarChart2, AlertTriangle, Brain, Award, FileStack, User,
} from "lucide-react"

export type SidebarView =
  | "dashboard"
  | "analytics"
  | "carrier-scorecard"
  | "exceptions"
  | "agent-activity"

interface SidebarProps {
  view: SidebarView
  onViewChange: (view: SidebarView) => void
  exceptionsCount?: number
}

export function Sidebar({ view, onViewChange, exceptionsCount = 7 }: SidebarProps) {
  return (
    <aside className="w-[260px] bg-[#0A0A0B] text-[#A1A1AA] flex flex-col shrink-0 border-r border-gray-800">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-gray-800">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <FileStack className="w-5 h-5 text-white" />
        </div>
        <div className="text-[14px] font-semibold text-white leading-tight">
          Operations Readiness<br />
          <span className="text-[11px] font-normal text-gray-400">ETA Control Tower</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        <SectionLabel>Portfolio</SectionLabel>

        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard size={15} />}
          active={view === "dashboard"}
          onClick={() => onViewChange("dashboard")}
        />
        <NavItem
          label="Analytics"
          icon={<BarChart2 size={15} />}
          active={view === "analytics"}
          onClick={() => onViewChange("analytics")}
        />
        <NavItem
          label="Carrier Scorecards"
          icon={<Award size={15} />}
          active={view === "carrier-scorecard"}
          onClick={() => onViewChange("carrier-scorecard")}
        />

        <div className="pt-3 pb-1" />
        <SectionLabel>Operations</SectionLabel>

        <NavItem
          label="Exceptions"
          icon={<AlertTriangle size={15} />}
          active={view === "exceptions"}
          onClick={() => onViewChange("exceptions")}
          badge={exceptionsCount}
        />
        <NavItem
          label="Agent Activity"
          icon={<Brain size={15} />}
          active={view === "agent-activity"}
          onClick={() => onViewChange("agent-activity")}
        />
      </nav>

      {/* Footer — User */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
            <User size={14} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Export Coordinator</div>
            <div className="text-[10px] text-gray-500 truncate">coordinator@company.com</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1.5 pt-1 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
      {children}
    </div>
  )
}

function NavItem({
  label, icon, active, onClick, badge,
}: {
  label: string; icon: React.ReactNode; active: boolean; onClick: () => void; badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors",
        active ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:bg-[#18181B] hover:text-white"
      )}
    >
      <span className={cn("shrink-0", active ? "text-blue-400" : "text-gray-500")}>{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge !== undefined && (
        <span className="shrink-0 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </button>
  )
}
