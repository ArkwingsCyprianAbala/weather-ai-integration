'use client'

import { Sparkles, Thermometer } from 'lucide-react'

export default function SettingsBar({ units, onUnitsChange, aiEnabled, onAiChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1 backdrop-blur-md">
        {['metric', 'imperial'].map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => onUnitsChange(u)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
              units === u
                ? 'bg-gradient-to-r from-sky-500/40 to-cyan-500/30 text-white shadow-lg shadow-sky-500/20'
                : 'text-sky-200/50 hover:text-sky-100'
            }`}
          >
            <Thermometer className="h-3.5 w-3.5" />
            {u === 'metric' ? '°C' : '°F'}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAiChange(!aiEnabled)}
        className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
          aiEnabled
            ? 'border-violet-400/40 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/15 text-violet-100 shadow-lg shadow-violet-500/15'
            : 'border-white/10 bg-black/20 text-sky-200/50 backdrop-blur-md hover:text-sky-100'
        }`}
        title="Toggle AI weather summary (uses API quota)"
      >
        <Sparkles className={`h-3.5 w-3.5 ${aiEnabled ? 'animate-pulse' : ''}`} />
        AI {aiEnabled ? 'on' : 'off'}
      </button>
    </div>
  )
}
