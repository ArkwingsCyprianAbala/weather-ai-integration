'use client'

import { Sparkles } from 'lucide-react'

export default function AiSummary({ summary }) {
  if (!summary) return null

  const text =
    typeof summary === 'string'
      ? summary
      : summary.text || summary.summary || summary.message

  if (!text) return null

  return (
    <section className="glass-card-ai animate-fade-up stagger-2 relative overflow-hidden p-6">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl"
        aria-hidden
      />
      <div className="relative mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 ring-1 ring-violet-400/30">
          <Sparkles className="h-5 w-5 text-violet-200" />
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200/90">
            AI Weather Insight
          </h2>
          <p className="text-[10px] text-violet-300/50">Powered by Gemini</p>
        </div>
      </div>
      <p className="relative text-[15px] leading-relaxed text-sky-50/95">{text}</p>
    </section>
  )
}
