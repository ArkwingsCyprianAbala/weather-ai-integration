'use client'

import { Gauge } from 'lucide-react'

export default function UsageBadge({ usage }) {
  if (!usage) return null

  const used = usage.requests_used ?? usage.used ?? usage.request_count
  const limit = usage.requests_limit ?? usage.limit ?? usage.monthly_limit
  const remaining = usage.requests_remaining ?? usage.remaining
  const pct =
    limit && used != null ? Math.min(100, Math.round((used / limit) * 100)) : null

  return (
    <div className="glass-card-light animate-fade-up stagger-6 flex items-center gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-400/25">
        <Gauge className="h-5 w-5 text-sky-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/45">
          API usage
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-sky-50">
          {used != null && limit != null
            ? `${used.toLocaleString()} / ${limit.toLocaleString()} requests`
            : remaining != null
              ? `${remaining.toLocaleString()} remaining`
              : 'Usage loaded'}
        </p>
        {pct != null && (
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-600 via-cyan-400 to-teal-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
      {usage.plan && (
        <span className="shrink-0 rounded-xl bg-gradient-to-r from-sky-500/25 to-cyan-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-100 ring-1 ring-sky-400/30">
          {usage.plan}
        </span>
      )}
    </div>
  )
}
