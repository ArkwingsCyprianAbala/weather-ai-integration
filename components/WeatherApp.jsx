'use client'

import { useCallback, useEffect, useState } from 'react'
import { CloudSun, RefreshCw, Zap } from 'lucide-react'
import SkyEffects from './SkyEffects'
import LoadingSkeleton from './LoadingSkeleton'
import { DEFAULT_LOCATION, STORAGE_KEYS } from '@/lib/constants'
import { locationLabel, skyTheme } from '@/lib/format'
import AiSummary from './AiSummary'
import DailyForecast from './DailyForecast'
import GlanceGrid from './GlanceGrid'
import HourlyForecast from './HourlyForecast'
import LocationSearch from './LocationSearch'
import SettingsBar from './SettingsBar'
import UsageBadge from './UsageBadge'
import WeatherHero from './WeatherHero'

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota errors */
  }
}

function extractAiSummary(data) {
  return (
    data?.ai_summary ??
    data?.aiSummary ??
    data?.summary ??
    data?.insights?.summary ??
    null
  )
}

async function fetchWeatherBundle(loc, units, ai) {
  const params = new URLSearchParams({
    lat: String(loc.lat),
    lon: String(loc.lon),
    days: '7',
    units,
    ai: String(ai),
  })
  const [weatherRes, usageRes] = await Promise.all([
    fetch(`/api/weather?${params}`),
    fetch('/api/usage').catch(() => null),
  ])
  const data = await weatherRes.json()
  if (!weatherRes.ok) {
    throw new Error(data.error || data.message || 'Failed to load weather')
  }
  let usageData = null
  if (usageRes?.ok) usageData = await usageRes.json()
  return { weather: data, usage: usageData }
}

export default function WeatherApp() {
  const [location, setLocation] = useState(
    () => readStorage(STORAGE_KEYS.lastLocation, DEFAULT_LOCATION) ?? DEFAULT_LOCATION,
  )
  const [weather, setWeather] = useState(null)
  const [usage, setUsage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [liveTime, setLiveTime] = useState('')
  const [units, setUnits] = useState(() => readStorage(STORAGE_KEYS.units, 'metric'))
  const [aiEnabled, setAiEnabled] = useState(() => readStorage(STORAGE_KEYS.ai, true))
  const [favorites, setFavorites] = useState(() => readStorage(STORAGE_KEYS.favorites, []))

  useEffect(() => {
    const tick = () =>
      setLiveTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const loadWeather = useCallback(
    async (loc, opts = {}) => {
      setLoading(true)
      setError(null)
      try {
        const { weather: data, usage: usageData } = await fetchWeatherBundle(
          loc,
          units,
          opts.ai ?? aiEnabled,
        )
        setWeather(data)
        setUsage(usageData)
        writeStorage(STORAGE_KEYS.lastLocation, loc)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setWeather(null)
      } finally {
        setLoading(false)
      }
    },
    [units, aiEnabled],
  )

  useEffect(() => {
    if (location?.lat == null) return
    let active = true
    fetchWeatherBundle(location, units, aiEnabled)
      .then(({ weather: data, usage: usageData }) => {
        if (!active) return
        setError(null)
        setWeather(data)
        setUsage(usageData)
        setLoading(false)
        writeStorage(STORAGE_KEYS.lastLocation, location)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || 'Something went wrong')
        setWeather(null)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [location, units, aiEnabled])

  function handleUnitsChange(next) {
    setLoading(true)
    setUnits(next)
    writeStorage(STORAGE_KEYS.units, next)
  }

  function handleAiChange(next) {
    setLoading(true)
    setAiEnabled(next)
    writeStorage(STORAGE_KEYS.ai, next)
  }

  function handleSelect(loc) {
    setLoading(true)
    setError(null)
    setLocation(loc)
  }

  function toggleFavorite(loc) {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.lat === loc.lat && f.lon === loc.lon)
      const next = exists
        ? prev.filter((f) => !(f.lat === loc.lat && f.lon === loc.lon))
        : [...prev, loc].slice(0, 6)
      writeStorage(STORAGE_KEYS.favorites, next)
      return next
    })
  }

  async function handleUseMyLocation() {
    setLocating(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.')
      setLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        setLocation({
          lat,
          lon,
          name: 'My location',
          region: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
          country: '',
        })
        setLocating(false)
      },
      async () => {
        try {
          const params = new URLSearchParams({
            ip: 'auto',
            days: '7',
            units,
            ai: String(aiEnabled),
          })
          const res = await fetch(`/api/weather-geo?${params}`)
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Could not detect location')

          const geo = data._geo ?? {}
          const lat = data.location?.lat ?? data.location?.requested_lat
          const lon = data.location?.lon ?? data.location?.requested_lon
          setWeather(data)
          setLocation({
            lat,
            lon,
            name: geo.city || 'Near you',
            region: geo.region || '',
            country: geo.country || '',
          })
        } catch (err) {
          setError(err.message || 'Could not detect your location')
        } finally {
          setLocating(false)
        }
      },
      { enableHighAccuracy: false, timeout: 12000 },
    )
  }

  const theme = weather?.current
    ? skyTheme(weather.current.condition_code, weather.current.icon)
    : 'clear-day'

  const displayLocation = {
    ...location,
    lat: weather?.location?.lat ?? location?.lat,
    lon: weather?.location?.lon ?? location?.lon,
    timezone: weather?.location?.timezone ?? location?.timezone,
  }

  const aiSummary = extractAiSummary(weather)
  const activeId = `${location?.lat}-${location?.lon}`

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="sky-bg" aria-hidden />
      <div className="sky-glow" aria-hidden />
      <SkyEffects />

      <main className="relative z-10 mx-auto w-full max-w-xl px-4 py-8 pb-20 sm:px-6 sm:py-10">
        <header className="animate-fade-up mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400/25 to-violet-500/20 ring-1 ring-white/20 shadow-lg shadow-sky-500/20">
              <CloudSun className="h-6 w-6 text-sky-200" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 ring-2 ring-[#040810]">
                <Zap className="h-2.5 w-2.5 text-white" />
              </span>
            </div>
            <div>
              <p className="bg-gradient-to-r from-sky-200 to-cyan-300 bg-clip-text text-[10px] font-bold uppercase tracking-[0.28em] text-transparent">
                WeatherAI
              </p>
              <p className="font-display text-lg font-semibold tracking-tight text-white">
                Forecast Studio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadWeather(location)}
            disabled={loading}
            className="rounded-2xl border border-white/12 bg-white/6 p-3 text-sky-200 shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-sky-400/30 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Refresh weather"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        <div className="mb-4 space-y-3">
          <LocationSearch
            onSelect={handleSelect}
            onUseMyLocation={handleUseMyLocation}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            activeId={activeId}
            locating={locating}
          />
          <SettingsBar
            units={units}
            onUnitsChange={handleUnitsChange}
            aiEnabled={aiEnabled}
            onAiChange={handleAiChange}
          />
        </div>

        {error && (
          <div className="animate-fade-up mb-5 rounded-2xl border border-red-400/30 bg-gradient-to-r from-red-500/15 to-rose-500/10 px-5 py-4 text-sm text-red-100 shadow-lg shadow-red-500/10 backdrop-blur-sm">
            {error}
          </div>
        )}

        {loading && !weather && (
          <LoadingSkeleton locationName={locationLabel(location)} />
        )}

        {weather && (
          <div
            className={`space-y-4 transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}
          >
            <WeatherHero
              location={displayLocation}
              current={weather.current}
              daily={weather.daily}
              hourly={weather.hourly}
              units={units}
              liveTime={liveTime}
            />

            <AiSummary summary={aiSummary} />

            <HourlyForecast hourly={weather.hourly} />
            <DailyForecast daily={weather.daily} />
            <GlanceGrid
              current={weather.current}
              daily={weather.daily}
              hourly={weather.hourly}
              units={units}
            />

            <UsageBadge usage={usage} />
          </div>
        )}

        <footer className="mt-12 text-center">
          <p className="text-[11px] tracking-wide text-sky-400/30">
            Powered by{' '}
            <a
              href="https://weather-ai.co/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400/55 underline-offset-2 hover:text-sky-300 hover:underline"
            >
              Weather-AI API
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}
