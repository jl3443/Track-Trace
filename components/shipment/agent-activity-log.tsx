"use client"

import { useState, useEffect } from "react"
import { AGENT_ACTIVITIES, SHIPMENTS, type AgentActionType } from "@/lib/mock-data"
import { Brain, RefreshCw, Bell, Flag, Lightbulb, ArrowRightLeft, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const ACTION_CONFIG: Record<AgentActionType, { icon: typeof Brain; label: string; color: string; iconColor: string }> = {
  detected: { icon: Search, label: "Detection", color: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
  recalculated: { icon: RefreshCw, label: "ETA Recalc", color: "bg-blue-50 border-blue-200", iconColor: "text-blue-600" },
  notified: { icon: Bell, label: "Notification", color: "bg-green-50 border-green-200", iconColor: "text-green-600" },
  flagged: { icon: Flag, label: "Flag", color: "bg-red-50 border-red-200", iconColor: "text-red-600" },
  recommended: { icon: Lightbulb, label: "Suggestion", color: "bg-purple-50 border-purple-200", iconColor: "text-purple-600" },
  synced: { icon: ArrowRightLeft, label: "OTM Sync", color: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-600" },
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-end gap-[3px] ml-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1 h-1 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  )
}

function AgentThinkingState({ label = "Analyzing shipments" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Brain size={13} className="text-blue-500 animate-pulse shrink-0" />
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <ThinkingDots />
    </div>
  )
}

interface AgentActivityLogProps {
  condensed?: boolean
  maxItems?: number
  onShipmentClick?: (shipmentId: string) => void
  onViewAll?: () => void
}

export function AgentActivityLog({ condensed, maxItems, onShipmentClick, onViewAll }: AgentActivityLogProps) {
  const items = maxItems ? AGENT_ACTIVITIES.slice(0, maxItems) : AGENT_ACTIVITIES
  const [thinking, setThinking] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (condensed) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent Activity</h3>
          </div>
          {onViewAll && (
            <button onClick={onViewAll} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View all &rarr;
            </button>
          )}
        </div>
        {thinking ? (
          <AgentThinkingState label="Scanning active shipments" />
        ) : (
          <div className="space-y-2">
            {items.map((a) => {
              const cfg = ACTION_CONFIG[a.actionType]
              const Icon = cfg.icon
              return (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className={cn("shrink-0 w-6 h-6 rounded flex items-center justify-center border", cfg.color)}>
                    <Icon size={12} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                      {a.description}
                      {a.shipmentId && onShipmentClick && (
                        <button
                          onClick={() => onShipmentClick(a.shipmentId!)}
                          className="ml-1 font-mono text-blue-600 hover:underline"
                        >
                          {a.shipmentId}
                        </button>
                      )}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Full-page view
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-6 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600/10 flex items-center justify-center">
            <Brain size={18} className="text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Agent Activity Log</h2>
            <p className="text-xs text-gray-500">Chronological feed of autonomous agent actions and decisions</p>
          </div>
        </div>

        {thinking ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <AgentThinkingState label="Loading agent decisions" />
          </div>
        ) : (
          <div className="space-y-1.5">
            {items.map((a) => {
              const cfg = ACTION_CONFIG[a.actionType]
              const Icon = cfg.icon
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-lg border border-gray-200 p-3.5 flex items-start gap-3 hover:border-gray-300 transition-colors"
                >
                  <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border", cfg.color)}>
                    <Icon size={14} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border", cfg.color, cfg.iconColor)}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-gray-400">{a.timestamp}</span>
                      {a.lane && (
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {a.lane}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{a.description}</p>
                    {a.shipmentId && onShipmentClick && (
                      <button
                        onClick={() => onShipmentClick(a.shipmentId!)}
                        className="mt-1 text-xs font-mono text-blue-600 hover:underline"
                      >
                        View {a.shipmentId} →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
