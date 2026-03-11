"use client"

import { useState } from "react"
import { SHIPMENTS, type Shipment } from "@/lib/mock-data"
import { ShipmentDrawer } from "./shipment-drawer"
import { Package, AlertTriangle, Plane, Ship, Truck, Train } from "lucide-react"
import { cn } from "@/lib/utils"

const SEV_COLOR: Record<string, string> = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High: "text-amber-700 bg-amber-50 border-amber-200",
  Medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Low: "text-green-700 bg-green-50 border-green-200",
}

function ModeIcon({ mode }: { mode: string }) {
  const cls = "shrink-0 text-gray-400"
  if (mode === "Air") return <Plane size={13} className={cls} />
  if (mode === "Ocean") return <Ship size={13} className={cls} />
  if (mode === "Rail") return <Train size={13} className={cls} />
  return <Truck size={13} className={cls} />
}

interface SearchResultsPageProps {
  query: string
  onOpenWeather?: (shipmentId: string) => void
}

export function SearchResultsPage({ query, onOpenWeather }: SearchResultsPageProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)

  const q = query.toLowerCase()
  const results = SHIPMENTS.filter(
    (s) =>
      s.id.toLowerCase().includes(q) ||
      s.carrier.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.currentStatus.toLowerCase().includes(q) ||
      s.exceptionType.toLowerCase().includes(q) ||
      s.severity.toLowerCase().includes(q) ||
      s.plant?.toLowerCase().includes(q)
  )

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-5 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {results.length === 0
              ? `No shipments matching "${query}"`
              : `${results.length} shipment${results.length !== 1 ? "s" : ""} matching `}
            {results.length > 0 && <span className="font-semibold text-gray-700">"{query}"</span>}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={cn(
                  "text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all",
                  selectedShipment?.id === s.id && "border-blue-400 ring-1 ring-blue-200"
                )}
              >
                {/* Top row: ID + severity */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-sm">{s.id}</span>
                    <ModeIcon mode={s.mode} />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold border rounded-full px-1.5 py-0.5 shrink-0",
                      SEV_COLOR[s.severity] ?? "text-gray-600 bg-gray-50 border-gray-200"
                    )}
                  >
                    {s.severity}
                  </span>
                </div>

                {/* Carrier */}
                <p className="text-xs font-medium text-gray-700 mb-1">{s.carrier}</p>

                {/* Route */}
                <p className="text-[11px] text-gray-500 mb-2">
                  {s.origin} → {s.destination}
                </p>

                {/* Status */}
                <p className="text-[11px] text-gray-500 truncate mb-2">{s.currentStatus}</p>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                    {s.exceptionType}
                  </span>
                  {s.delayHours > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-600">
                      <AlertTriangle size={9} /> +{s.delayHours}h
                    </span>
                  )}
                  {s.criticalMaterial && (
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5">
                      Critical Material
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Package size={36} className="text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">No shipments found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try searching by ID, carrier, origin, destination, or status
            </p>
          </div>
        )}
      </div>

      {selectedShipment && (
        <ShipmentDrawer
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onOpenWeather={onOpenWeather}
        />
      )}
    </div>
  )
}
