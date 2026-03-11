"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, X, Send, ChevronRight, AlertTriangle, Clock } from "lucide-react"
import { SHIPMENTS, type Shipment } from "@/lib/mock-data"
import { ShipmentDrawer } from "./shipment-drawer"
import { type SentEmailItem } from "./email-sent-page"
import { cn } from "@/lib/utils"

// ── AI Response types + generator ─────────────────────────────────────────────

interface AIResponseLine {
  id: string
  delay: number
  severity: string
  exception: string
  note: string
}

interface AIResponseData {
  heading: string
  summary: string
  lines: AIResponseLine[]
  footer?: string
}

function generateAIResponse(query: string): AIResponseData {
  const q = query.toLowerCase()

  const delayed = SHIPMENTS.filter((s) => s.delayHours > 0).sort((a, b) => b.delayHours - a.delayHours)
  const critical = SHIPMENTS.filter((s) => s.severity === "Critical")
  const high = SHIPMENTS.filter((s) => s.severity === "High")
  const weatherTraffic = SHIPMENTS.filter(
    (s) => s.exceptionType === "Weather Disruption" || s.exceptionType === "Traffic Disruption"
  )
  const customsHold = SHIPMENTS.filter((s) => s.exceptionType === "Customs Hold")

  if (q.includes("eta") || q.includes("update") || q.includes("delay") || q.includes("延误") || q.includes("迟")) {
    return {
      heading: "Shipments Requiring ETA Update",
      summary: `${delayed.length} shipments have active delays totaling +${delayed.reduce((sum, s) => sum + s.delayHours, 0)}h across the portfolio. Recommended to review and push revised ETAs to OTM.`,
      lines: delayed.map((s) => ({
        id: s.id,
        delay: s.delayHours,
        severity: s.severity,
        exception: s.exceptionType,
        note: s.revisedETA.replace("2025 ", ""),
      })),
      footer: "Action: Open each shipment → OTM & Notifications tab → Approve OTM Update",
    }
  }

  if (q.includes("risk") || q.includes("critical") || q.includes("风险") || q.includes("危") || q.includes("urgent")) {
    const riskShipments = [...critical, ...high.filter((s) => s.criticalMaterial)]
    return {
      heading: "High-Risk Shipments",
      summary: `${critical.length} Critical and ${high.length} High severity shipments detected. ${critical.filter((s) => s.criticalMaterial).length + high.filter((s) => s.criticalMaterial).length} flagged as Critical Material with production line risk.`,
      lines: riskShipments.map((s) => ({
        id: s.id,
        delay: s.delayHours,
        severity: s.severity,
        exception: s.exceptionType,
        note: s.plant,
      })),
      footer: "Recommended: Escalate Critical Material shipments immediately via Exceptions page",
    }
  }

  if (
    q.includes("weather") ||
    q.includes("traffic") ||
    q.includes("storm") ||
    q.includes("天气") ||
    q.includes("disruption")
  ) {
    return {
      heading: "Weather & Traffic Disruptions",
      summary: `${weatherTraffic.length} shipments impacted by weather or traffic events. PVG ground stop (typhoon remnant) is the highest-impact active disruption.`,
      lines: weatherTraffic.map((s) => ({
        id: s.id,
        delay: s.delayHours,
        severity: s.severity,
        exception: s.exceptionType,
        note: s.disruptionContext?.split(".")[0] ?? s.currentStatus,
      })),
      footer: "See Weather / Traffic page for full disruption context and lane risk summary",
    }
  }

  if (q.includes("customs") || q.includes("hold") || q.includes("清关") || q.includes("海关")) {
    return {
      heading: "Customs Hold Shipments",
      summary: `${customsHold.length} shipment(s) under customs hold. These require immediate broker coordination to avoid further slippage.`,
      lines: customsHold.map((s) => ({
        id: s.id,
        delay: s.delayHours,
        severity: s.severity,
        exception: s.exceptionType,
        note: s.recommendedAction,
      })),
      footer: "Action: Coordinate with customs broker and provide missing documentation",
    }
  }

  return {
    heading: "Portfolio Status Overview",
    summary: `Monitoring ${SHIPMENTS.length} active shipments. ${critical.length} Critical, ${high.length} High severity. Total delay exposure: +${delayed.reduce((sum, s) => sum + s.delayHours, 0)}h across ${delayed.length} shipments.`,
    lines: SHIPMENTS.slice(0, 5).map((s) => ({
      id: s.id,
      delay: s.delayHours,
      severity: s.severity,
      exception: s.exceptionType,
      note: s.currentStatus,
    })),
    footer: `Tip: Ask about "delays", "risk", "weather disruptions", or "customs holds" for targeted insights`,
  }
}

const SEV_COLOR: Record<string, string> = {
  Critical: "text-red-700 bg-red-50 border-red-200",
  High: "text-amber-700 bg-amber-50 border-amber-200",
  Medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Low: "text-green-700 bg-green-50 border-green-200",
}

const SUGGESTION_CHIPS = [
  "Which orders need ETA update?",
  "Show high-risk shipments",
  "Any weather disruptions?",
  "Customs holds status",
]

// ── Chat types ─────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  response?: AIResponseData
}

// ── Component ──────────────────────────────────────────────────────────────────

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
  onOpenWeather?: (shipmentId: string) => void
  onSendNotification?: (email: SentEmailItem) => void
}

export function AIChatPanel({ open, onClose, onOpenWeather, onSendNotification }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const handleQuery = (q: string) => {
    if (!q.trim() || isThinking) return
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", text: q }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsThinking(true)
    setTimeout(() => {
      const response = generateAIResponse(q)
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: response.summary,
        response,
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsThinking(false)
    }, 1400)
  }

  if (!open) return null

  return (
    <>
      {/* Dim backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[380px] z-50 bg-white border-l border-gray-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center">
              <Brain size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-none">AI Assistant</p>
              <p className="text-[10px] text-indigo-500 mt-0.5">Shipment intelligence agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-gray-400 text-center">
                Ask about your shipments, exceptions, or delays
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleQuery(chip)}
                    className="text-left text-[11px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg px-3 py-2 leading-tight transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "user" ? (
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] text-xs leading-relaxed">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[98%] space-y-2">
                  {msg.response && (
                    <>
                      <p className="text-[11px] font-semibold text-gray-800">{msg.response.heading}</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{msg.response.summary}</p>
                      <div className="space-y-1">
                        {msg.response.lines.slice(0, 4).map((line) => {
                          const shipment = SHIPMENTS.find((s) => s.id === line.id)
                          return (
                            <button
                              key={line.id}
                              onClick={() => {
                                if (shipment) setSelectedShipment(shipment)
                              }}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-200 border border-gray-100 transition-colors text-left"
                            >
                              <span className="font-mono font-bold text-blue-700 text-[10px] w-16 shrink-0">
                                {line.id}
                              </span>
                              <span
                                className={cn(
                                  "text-[9px] font-semibold border rounded-full px-1 py-0.5 shrink-0",
                                  SEV_COLOR[line.severity] ?? "text-gray-600 bg-gray-50 border-gray-200"
                                )}
                              >
                                {line.severity}
                              </span>
                              {line.delay > 0 && (
                                <span className="flex items-center gap-0.5 text-[9px] font-semibold text-red-600 shrink-0">
                                  <Clock size={8} /> +{line.delay}h
                                </span>
                              )}
                              <span className="text-[9px] text-gray-400 flex-1 truncate">{line.note}</span>
                              <ChevronRight size={9} className="text-gray-300 shrink-0" />
                            </button>
                          )
                        })}
                      </div>
                      {msg.response.footer && (
                        <p className="text-[9px] text-indigo-500 border-t border-indigo-100 pt-1.5 flex items-center gap-1">
                          <AlertTriangle size={8} /> {msg.response.footer}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
                <Brain size={11} className="text-indigo-500 animate-pulse" />
                <span className="text-[11px] text-gray-500">Thinking</span>
                <span className="inline-flex items-end gap-[3px]">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${d}ms`, animationDuration: "900ms" }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuery(inputValue)
              }}
              placeholder="Ask about your shipments..."
              className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-400"
            />
            <button
              onClick={() => handleQuery(inputValue)}
              disabled={!inputValue.trim() || isThinking}
              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={12} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {selectedShipment && (
        <ShipmentDrawer
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onOpenWeather={onOpenWeather}
          onSendNotification={onSendNotification}
        />
      )}
    </>
  )
}
