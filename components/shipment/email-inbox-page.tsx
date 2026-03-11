"use client"

import { useState } from "react"
import { INBOX_EMAILS, type InboxEmail, type EmailTag } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Mail, MailOpen, Tag, Clock, Package, ChevronLeft } from "lucide-react"

const TAG_CONFIG: Record<EmailTag, { label: string; color: string }> = {
  carrier:    { label: "Carrier",    color: "bg-blue-50 border-blue-200 text-blue-700" },
  customs:    { label: "Customs",    color: "bg-red-50 border-red-200 text-red-700" },
  weather:    { label: "Weather",    color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  compliance: { label: "Compliance", color: "bg-purple-50 border-purple-200 text-purple-700" },
  advisory:   { label: "Advisory",   color: "bg-amber-50 border-amber-200 text-amber-700" },
  agent:      { label: "Agent",      color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
}

export function EmailInboxPage() {
  const [emails, setEmails] = useState<InboxEmail[]>(INBOX_EMAILS)
  const [selected, setSelected] = useState<InboxEmail | null>(null)

  const unreadCount = emails.filter((e) => !e.read).length

  const handleSelect = (email: InboxEmail) => {
    setSelected(email)
    setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, read: true } : e))
  }

  return (
    <div className="flex-1 overflow-hidden bg-[#F8F9FA] flex flex-col">
      <div className="p-6 pb-3 max-w-[1100px] mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Mail size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
              <p className="text-xs text-gray-400">Carrier advisories, customs notices, and alerts</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold bg-blue-600 text-white rounded-full px-2.5 py-1">
              {unreadCount} unread
            </span>
          )}
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
              {emails.length} messages
            </span>
          </div>
          <div className="overflow-y-auto flex-1">
            {emails.map((email) => {
              const tagCfg = TAG_CONFIG[email.tag]
              const isSelected = selected?.id === email.id
              return (
                <button
                  key={email.id}
                  onClick={() => handleSelect(email)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors",
                    isSelected && "bg-blue-50/60 border-l-2 border-l-blue-500",
                    !email.read && "bg-white"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1 shrink-0">
                      {email.read
                        ? <MailOpen size={13} className="text-gray-300" />
                        : <Mail size={13} className="text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={cn("text-xs truncate", email.read ? "text-gray-500 font-normal" : "text-gray-800 font-semibold")}>
                          {email.fromName}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">{email.timestamp}</span>
                      </div>
                      <div className={cn("text-[11px] mb-1 truncate", email.read ? "text-gray-500" : "text-gray-700 font-medium")}>
                        {email.subject}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-[9px] font-semibold border rounded-full px-1.5 py-0.5", tagCfg.color)}>
                          {tagCfg.label}
                        </span>
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
            {/* Detail header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 mb-3 transition-colors"
              >
                <ChevronLeft size={12} /> Back
              </button>
              <h3 className="text-sm font-semibold text-gray-800 mb-2 leading-snug">{selected.subject}</h3>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span>From: <span className="text-gray-600 font-medium">{selected.fromName}</span> &lt;{selected.from}&gt;</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {selected.timestamp}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[10px] font-semibold border rounded-full px-2 py-0.5", TAG_CONFIG[selected.tag].color)}>
                  <Tag size={9} className="inline mr-1" />{TAG_CONFIG[selected.tag].label}
                </span>
                {selected.shipmentId && (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                    <Package size={9} /> {selected.shipmentId}
                  </span>
                )}
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                {selected.body}
              </pre>
            </div>
          </div>
        ) : (
          <div className="hidden" />
        )}

        {/* Empty state when nothing selected and list is shown full-width */}
        {!selected && (
          <div className="hidden" />
        )}
      </div>
    </div>
  )
}
