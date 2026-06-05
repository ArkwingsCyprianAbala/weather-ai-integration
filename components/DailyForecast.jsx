'use client'

import { fmtDay } from '@/lib/format'
import WeatherIcon from './WeatherIcon'

function tempRangeStyle(daily, d) {
  const temps = daily.flatMap((x) => [x.temp_min, x.temp_max]).filter(Number.isFinite)
  if (!temps.length) return { left: '0%', width: '50%' }
  const minAll = Math.min(...temps)
  const maxAll = Math.max(...temps)
  const span = maxAll - minAll || 1
  const left = ((d.temp_min - minAll) / span) * 100
  const width = ((d.temp_max - d.temp_min) / span) * 100
  return { left: `${left}%`, width: `${Math.max(width, 8)}%` }
}

export default function DailyForecast({ daily = [] }) {
  return (
    <section className="glass-card-light animate-fade-up stagger-4 p-5 sm:p-6">
      <h2 className="section-title">{daily.length}-day forecast</h2>
      <ul className="space-y-1">
        {daily.map((d, i) => {
          const range = tempRangeStyle(daily, d)
          const precip = d.precipitation_probability ?? 0
          return (
            <li
              key={d.date ?? i}
              className={`group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.04] ${
                i === 0 ? 'bg-white/[0.03]' : ''
              }`}
            >
              <span
                className={`w-12 shrink-0 text-sm font-medium ${
                  i === 0 ? 'text-white' : 'text-sky-300/65'
                }`}
              >
                {fmtDay(d.date, i)}
              </span>
              <WeatherIcon
                src={d.icon}
                alt=""
                className="h-7 w-7 shrink-0 transition group-hover:scale-110"
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="temp-range-track">
                  <div
                    className="temp-range-fill"
                    style={{ left: range.left, width: range.width }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-sky-400/50">
                  <span>{precip}% rain</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 tabular-nums">
                <span className="w-7 text-right text-sm text-sky-400/65">
                  {Math.round(d.temp_min)}°
                </span>
                <span className="text-white/15">–</span>
                <span className="w-7 text-right text-sm font-semibold text-white">
                  {Math.round(d.temp_max)}°
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
