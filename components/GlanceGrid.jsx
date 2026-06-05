'use client'

import {
  Compass,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  CloudRain,
} from 'lucide-react'
import { fmtTime } from '@/lib/format'

const ICONS = {
  'Feels like': Thermometer,
  'UV index': Sun,
  'Wind gust': Wind,
  Sunset: Sun,
  Precipitation: CloudRain,
  'Wind direction': Compass,
}

export default function GlanceGrid({ current, daily, hourly, units }) {
  const today = daily?.[0]
  const nowHr = new Date().getHours()
  const curHr =
    hourly?.find((h) => new Date(h.time).getHours() === nowHr) ?? hourly?.[0]

  const items = [
    {
      label: 'Feels like',
      value: `${Math.round(curHr?.feels_like ?? current?.feels_like ?? current?.temperature ?? 0)}°`,
    },
    {
      label: 'UV index',
      value: current?.uv_index?.toFixed(1) ?? curHr?.uv_index?.toFixed(1) ?? '—',
    },
    {
      label: 'Wind gust',
      value: `${Math.round(curHr?.wind_gust ?? current?.wind_gust ?? 0)} ${units === 'imperial' ? 'mph' : 'km/h'}`,
    },
    {
      label: 'Sunset',
      value: today?.sunset ? fmtTime(today.sunset) : '—',
    },
    {
      label: 'Precipitation',
      value: `${today?.precipitation_sum ?? 0} mm`,
    },
    {
      label: 'Wind direction',
      value: current?.wind_direction != null ? `${current.wind_direction}°` : '—',
    },
  ]

  return (
    <section className="glass-card-light animate-fade-up stagger-5 p-5 sm:p-6">
      <h2 className="section-title">Details</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.label] ?? Droplets
          return (
            <div
              key={item.label}
              className="group rounded-2xl border border-white/6 bg-gradient-to-br from-white/[0.05] to-transparent p-4 transition hover:border-white/12 hover:from-white/[0.08]"
            >
              <Icon className="mb-2 h-4 w-4 text-sky-400/50 transition group-hover:text-sky-300/80" />
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-sky-300/40">
                {item.label}
              </p>
              <p className="mt-1 font-mono text-xl font-medium text-white">{item.value}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
