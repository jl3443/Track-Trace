"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Send, Clock, Package, ChevronLeft, MailOpen } from "lucide-react"

// Exported type — also used by exception-workbench + app-shell
export interface SentEmailItem {
  id: string
  to: string
  toName: string
  subject: string
  body: string
  timestamp: string
  shipmentId?: string
  tag?: "delay" | "route" | "escalation" | "customs"
}

const STATIC_SENT_EMAILS: SentEmailItem[] = [
  {
    id: "SE-001",
    to: "ops@cosco.com",
    toName: "COSCO Operations",
    subject: "Escalation Request — SHP-10421 — Berth Priority",
    body: `Dear COSCO Operations team,

We are writing to escalate berth priority for shipment COSU8812045 aboard COSCO GLORY. The current congestion at WBCT Terminal has pushed our revised ETA to March 13, resulting in a 38-hour delay.

The consignee (AutoParts West) has a production line dependency on this cargo. We respectfully request that your team expedite berth assignment or arrange lightering if possible.

Please confirm receipt and advise next steps.

Best regards,
Export Coordination Team`,
    timestamp: "Mar 12, 10:05",
    shipmentId: "SHP-10421",
    tag: "delay",
  },
  {
    id: "SE-002",
    to: "broker@cbp-compliance.com",
    toName: "Licensed Customs Broker",
    subject: "TSCA Documentation — SHP-20334 — Urgent Submission Required",
    body: `Hi,

Per CBP Hold Notice received today (Entry #ORD-2024-98812), we need to submit TSCA Section 6 documentation for shipment SHP-20334 within 48 hours.

Attached documents (to be sent separately):
1. TSCA Compliance Certificate (Section 6(a)) — sourced from supplier
2. Supplier Declaration of Compliance — on file
3. SDS/MSDS — will be forwarded by supplier EOD

Please confirm receipt and file with CBP ORD as soon as possible to avoid extended hold.

Urgently,
Export Coordination`,
    timestamp: "Mar 11, 17:10",
    shipmentId: "SHP-20334",
    tag: "customs",
  },
  {
    id: "SE-003",
    to: "cargo@emirates.com",
    toName: "Emirates SkyCargo",
    subject: "Rebooking Confirmation Request — AWB 176-4429871 — SHP-70991",
    body: `Dear Emirates SkyCargo team,

Following the DXB hub capacity advisory received earlier, please confirm the alternate routing for AWB 176-4429871:

Proposed alternate: BOM → FRA → LAX (EK7723 + EK7731)
Requested departure: Mar 13 or earliest available

Please confirm rebooking and issue revised AWB. Our client (Pharma Logistics Inc.) requires temperature-controlled handling (2–8°C) throughout.

Thank you,
Export Coordination`,
    timestamp: "Mar 11, 14:30",
    shipmentId: "SHP-70991",
    tag: "route",
  },
]

const TAG_CONFIG: Record<NonNullable<SentEmailItem["tag"]>, { label: string; color: string }> = {
  delay:      { label: "Delay Alert",  color: "bg-red-50 border-red-200 text-red-700" },
  route:      { label: "Route Change", color: "bg-blue-50 border-blue-200 text-blue-700" },
  escalation: { label: "Escalation",  color: "bg-orange-50 border-orange-200 text-orange-700" },
  customs:    { label: "Customs",      color: "bg-purple-50 border-purple-200 text-purple-700" },
}

interface EmailSentPageProps {
  dynamicEmails?: SentEmailItem[]
}

export function EmailSentPage({ dynamicEmails = [] }: EmailSentPageProps) {
  const allEmails = [...dynamicEmails, ...STATIC_SENT_EMAILS]
  const [selected, setSelected] = useState<SentEmailItem | null>(null)

  return (
    <div className="flex-1 overflow-hidden bg-[#F8F9FA] flex flex-col">
      <div className="p-6 pb-3 max-w-[1100px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Send size={16} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Sent</h2>
              <p className="text-xs text-gray-400">Outbound delay alerts, route change notices, and escalations</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">{allEmails.length} messages</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-[1100px] mx-auto w-full px-6 pb-6 gap-4">
        {/* Email list */}
        <div className={cn(
          "flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0",
          selected ? "w-72" : "flex-1"
        )}>
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              {allEmails.length} sent messages
            </span>
          </div>
          <div className="overflow-y-auto flex-1">
            {allEmails.map((email) => {
              const tagCfg = email.tag ? TAG_CONFIG[email.tag] : null
              const isSelected = selected?.id === email.id
              return (
                <button
                  key={email.id}
                  onClick={() => setSelected(isSelected ? null : email)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                    isSelected && "bg-blue-50/60 border-l-2 border-l-blue-500"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1 shrink-0">
                      <MailOpen size={13} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs text-gray-500 font-normal truncate">To: {email.toName}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{email.timestamp}</span>
                      </div>
                      <div className="text-[11px] mb-1 truncate text-gray-700 font-medium">
                        {email.subject}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tagCfg && (
                          <span className={cn("text-[9px] font-semibold border rounded-full px-1.5 py-0.5", tagCfg.color)}>
                            {tagCfg.label}
                          </span>
                        )}
                        {email.shipmentId && (
                          <span className="text-[9px] font-mono text-blue-700 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
                            {email.shipmentId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Email detail */}
        {selected ? (
          <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 mb-3 transition-colors"
              >
                <ChevronLeft size={12} /> Back
              </button>
              <h3 className="text-sm font-semibold text-gray-800 mb-2 leading-snug">{selected.subject}</h3>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span>To: <span className="text-gray-600 font-medium">{selected.toName}</span> &lt;{selected.to}&gt;</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {selected.timestamp}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {selected.tag && (
                  <span className={cn("text-[10px] font-semibold border rounded-full px-2 py-0.5", TAG_CONFIG[selected.tag].color)}>
                    {TAG_CONFIG[selected.tag].label}
                  </span>
                )}
                {selected.shipmentId && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                    <Package size={9} /> {selected.shipmentId}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                {selected.body}
              </pre>
            </div>
          </div>
        ) : (
          <div className="hidden" />
        )}
      </div>
    </div>
  )
}
