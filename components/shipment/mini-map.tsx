"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { Shipment } from "@/lib/mock-data"
import { ChevronDown, ChevronUp } from "lucide-react"

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center bg-gray-50 text-xs text-gray-400">
      Loading map...
    </div>
  ),
})

interface MiniMapProps {
  onShipmentClick?: (s: Shipment) => void
}

export function MiniMap({ onShipmentClick }: MiniMapProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full flex flex-col" style={{ isolation: "isolate" }}>
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => setCollapsed(!collapsed)}
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Geographic Overview
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Critical
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Normal
            </span>
          </div>
          {collapsed ? (
            <ChevronDown size={13} className="text-gray-400" />
          ) : (
            <ChevronUp size={13} className="text-gray-400" />
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
          <LeafletMap onShipmentClick={onShipmentClick} />
        </div>
      )}
    </div>
  )
}
