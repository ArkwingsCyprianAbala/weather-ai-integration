'use client'

import { fmtHour } from '@/lib/format'
import WeatherIcon from './WeatherIcon'

export default function HourlyForecast({ hourly = [] }) {
  const nowHr = new Date().getHours()
  const slice = hourly.slice(0, 24)

  return (
    <section className="glass-card-light animate-fade-up stagger-3 p-5 sm:p-6">
      <h2 className="section-title">Hourly forecast</h2>
      <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto pb-2 pt-1">
        {slice.map((h, i) => {
          const hour = new Date(h.time).getHours()
          const isNow = hour === nowHr
          const precip = h.precipitation_probability ?? 0
          return (
            <div
              key={h.time ?? i}
              className={`flex min-w-[62px] shrink-0 flex-col items-center gap-2 rounded-2xl px-2.5 py-3 transition ${
                isNow
                  ? 'hour-pill-now scale-105'
                  : 'hover:bg-white/[0.05]'
              }`}
            >
              <span
                className={`text-[10px] font-medium uppercase tracking-wide ${
                  isNow ? 'text-sky-200' : 'text-sky-300/50'
                }`}
              >
                {isNow ? 'Now' : fmtHour(h.time)}
              </span>
              <WeatherIcon src={h.icon} alt="" className="h-8 w-8" />
              <span className="text-base font-semibold text-white">
                {Math.round(h.temperature)}°
              </span>
              <div className="flex items-center gap-0.5">
                <span
                  className={`text-[10px] font-medium ${
                    precip > 50 ? 'text-cyan-300' : 'text-sky-400/60'
                  }`}
                >
                  {precip}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
