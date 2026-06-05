'use client'

import { Droplets, Sunrise, Sunset, Wind } from 'lucide-react'
import { conditionLabel, coordsLabel, fmtTime, tempUnit } from '@/lib/format'
import WeatherIcon from './WeatherIcon'

export default function WeatherHero({
  location,
  current,
  daily,
  hourly,
  units,
  liveTime,
}) {
  const today = daily?.[0]
  const nowHr = new Date().getHours()
  const curHr =
    hourly?.find((h) => new Date(h.time).getHours() === nowHr) ??
    hourly?.[7]

  const stats = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${curHr?.humidity ?? current?.humidity ?? '—'}%`,
      color: 'text-cyan-400/80',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${Math.round(current?.wind_speed ?? 0)} ${units === 'imperial' ? 'mph' : 'km/h'}`,
      color: 'text-sky-400/80',
    },
    {
      icon: Sunrise,
      label: 'Sunrise',
      value: today?.sunrise ? fmtTime(today.sunrise) : '—',
      color: 'text-amber-400/80',
    },
    {
      icon: Sunset,
      label: 'Rain chance',
      value: `${today?.precipitation_probability ?? 0}%`,
      color: 'text-indigo-400/80',
    },
  ]

  return (
    <section className="glass-card animate-fade-up stagger-1 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-300/55">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {location?.country ?? 'Live'} ·{' '}
            {location?.timezone?.split('/')?.pop()?.replace(/_/g, ' ') ?? 'Local'}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-white sm:text-[2.75rem] text-glow">
            {location?.name ?? 'Weather'}
          </h1>
          {location?.region && (
            <p className="mt-1.5 text-sm text-sky-200/45">{location.region}</p>
          )}
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full border border-white/15 bg-white/8 px-3 py-1.5 font-mono text-[10px] text-sky-100/90 backdrop-blur-sm">
            {coordsLabel(location?.lat, location?.lon)}
          </span>
          <p className="mt-2 font-mono text-[11px] tabular-nums text-sky-400/55">{liveTime}</p>
        </div>
      </div>

      <div className="relative mt-8 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="temp-display font-mono text-[5rem] font-light leading-none tracking-tighter sm:text-[6.25rem]">
            {Math.round(current?.temperature ?? 0)}
            <span className="text-[2.5rem] font-light text-sky-200/35 sm:text-3xl">
              {tempUnit(units)}
            </span>
          </div>
          <p className="mt-3 text-xl font-medium text-white/90">
            {conditionLabel(current?.condition_code)}
          </p>
          {today && (
            <div className="mt-2 inline-flex gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-sky-200/70">
              <span>
                H <strong className="font-semibold text-white">{Math.round(today.temp_max)}°</strong>
              </span>
              <span className="text-white/20">|</span>
              <span>
                L <strong className="font-semibold text-sky-300/90">{Math.round(today.temp_min)}°</strong>
              </span>
            </div>
          )}
        </div>
        <div className="hero-icon-ring icon-float shrink-0">
          <WeatherIcon
            src={current?.icon}
            alt={conditionLabel(current?.condition_code)}
            className="relative h-28 w-28 drop-shadow-2xl sm:h-32 sm:w-32"
          />
        </div>
      </div>

      <div className="relative my-7 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/6 bg-white/[0.04] px-3 py-4 text-center transition hover:bg-white/[0.07]"
          >
            <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} />
            <p className="text-lg font-semibold text-white">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-sky-300/40">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
