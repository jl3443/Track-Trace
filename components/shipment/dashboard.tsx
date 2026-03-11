"use client"

import { useState, useEffect } from "react"
import { SHIPMENTS, type Shipment } from "@/lib/mock-data"
import { KPICards } from "./kpi-cards"
import { AgentActivityLog } from "./agent-activity-log"
import { ShipmentTable } from "./shipment-table"
import { ExceptionDistributionPanel, DDRiskPanel } from "./exception-panels"
import { MiniMap } from "./mini-map"
import { ShipmentDrawer } from "./shipment-drawer"
import { type SidebarView } from "./sidebar"
import { Brain } from "lucide-react"

interface DashboardProps {
  searchQuery: string
  onViewChange?: (view: SidebarView) => void
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-end gap-[3px] ml-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  )
}

export function Dashboard({ searchQuery, onViewChange }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [analysisThinking, setAnalysisThinking] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setAnalysisThinking(false), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-5 space-y-4 max-w-[1600px] mx-auto">
        {/* AI Agent Analysis — thinking animation → output */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
          <div className="flex items-start gap-2.5">
            <Brain size={14} className={`text-indigo-600 mt-0.5 shrink-0 ${analysisThinking ? "animate-pulse" : ""}`} />
            {analysisThinking ? (
              <div className="flex items-center gap-1.5 py-0.5">
                <span className="text-xs text-indigo-600 font-medium">Analyzing portfolio</span>
                <ThinkingDots />
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                  Monitoring 7 active shipments across 3 corridors — 2 Critical exceptions detected (SHP-40672, SHP-70991) requiring immediate carrier escalation.
                </p>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  APAC→Americas corridor averaging +19h delay driven by Customs Hold and Long Dwell at DXB hub. Recommend pre-advising receiving teams at Detroit Plant and LAX Receiving Dock.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Condensed Agent Activity Feed */}
        <AgentActivityLog
          condensed
          maxItems={1}
          onShipmentClick={(id) => {
            const s = SHIPMENTS.find((sh) => sh.id === id)
            if (s) setSelectedShipment(s)
          }}
          onViewAll={() => onViewChange?.("agent-activity")}
        />

        {/* KPI Cards */}
        <KPICards
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onExceptionsClick={() => onViewChange?.("exceptions")}
        />

        {/* Exception distribution + Likely Delay Order + Geographic Overview — above table */}
        <div className="grid grid-cols-3 gap-4">
          <ExceptionDistributionPanel onExceptionClick={() => onViewChange?.("exceptions")} />
          <DDRiskPanel onShipmentClick={(id) => {
            const s = SHIPMENTS.find((sh) => sh.id === id)
            if (s) setSelectedShipment(s)
          }} />
          <MiniMap onShipmentClick={setSelectedShipment} />
        </div>

        {/* Shipment Table — below panels */}
        <ShipmentTable
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          onSelectShipment={setSelectedShipment}
          selectedId={selectedShipment?.id ?? null}
        />
      </div>

      {/* Detail Drawer */}
      {selectedShipment && (
        <ShipmentDrawer
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  )
}
