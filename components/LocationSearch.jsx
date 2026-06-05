'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, MapPin, Navigation, Search, Star, X } from 'lucide-react'
import { locationLabel } from '@/lib/format'

export default function LocationSearch({
  onSelect,
  onUseMyLocation,
  favorites = [],
  onToggleFavorite,
  activeId,
  locating = false,
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapRef = useRef(null)
  const debounceRef = useRef(null)

  const search = useCallback(async (text) => {
    if (!text || text.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`)
      const data = await res.json()
      setResults(data.results ?? [])
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 320)
    return () => clearTimeout(debounceRef.current)
  }, [query, search])

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function pick(loc) {
    setQuery('')
    setOpen(false)
    setResults([])
    onSelect(loc)
  }

  const isFavorite = (loc) =>
    favorites.some((f) => f.lat === loc.lat && f.lon === loc.lon)

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder="Search any city worldwide…"
            className="input-glow w-full rounded-2xl border border-white/12 bg-black/25 py-3.5 pl-11 pr-11 text-sm text-white shadow-inner shadow-black/20 placeholder:text-sky-200/30 outline-none transition focus:border-sky-400/40 focus:bg-black/35"
            aria-label="Search for a location"
          />
          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
                setOpen(false)
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-sky-300/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {loading && (
            <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-cyan-400" />
          )}
        </div>
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={locating}
          className="group flex shrink-0 items-center gap-2 rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-sky-600/15 px-4 py-3.5 text-xs font-semibold text-cyan-100 shadow-lg shadow-cyan-500/10 transition hover:from-cyan-500/30 hover:shadow-cyan-500/20 disabled:opacity-50"
          title="Use my location"
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 transition group-hover:scale-110" />
          )}
          <span className="hidden sm:inline">Near me</span>
        </button>
      </div>

      {open && results.length > 0 && (
        <ul
          className="absolute z-50 mt-2.5 max-h-72 w-full overflow-auto rounded-2xl border border-white/12 bg-[#0a1428]/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-2xl"
          role="listbox"
        >
          {results.map((loc, i) => (
            <li
              key={loc.id}
              className="flex items-center gap-1 animate-fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => pick(loc)}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/8"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/15">
                  <MapPin className="h-4 w-4 text-sky-400" />
                </span>
                <span className="text-sky-50">{locationLabel(loc)}</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite?.(loc)}
                className="mr-2 shrink-0 rounded-xl p-2.5 text-sky-400/50 transition hover:bg-amber-500/10 hover:text-amber-300"
                aria-label={isFavorite(loc) ? 'Remove favorite' : 'Add favorite'}
              >
                <Star
                  className={`h-4 w-4 transition ${isFavorite(loc) ? 'fill-amber-300 text-amber-300 scale-110' : ''}`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {favorites.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2">
          {favorites.map((loc) => {
            const active = activeId === `${loc.lat}-${loc.lon}`
            return (
              <button
                key={`${loc.lat}-${loc.lon}`}
                type="button"
                onClick={() => onSelect(loc)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300 ${
                  active
                    ? 'border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/15 text-amber-100 shadow-md shadow-amber-500/10'
                    : 'border-white/10 bg-white/5 text-sky-200/75 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <Star
                  className={`h-3 w-3 ${active ? 'fill-amber-300 text-amber-300' : 'text-amber-400/60'}`}
                />
                {loc.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
