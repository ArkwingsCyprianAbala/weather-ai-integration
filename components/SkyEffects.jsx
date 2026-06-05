'use client'

import { useMemo } from 'react'

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 85}%`,
        d: `${2 + (i % 4)}s`,
        delay: `${(i % 10) * 0.3}s`,
        size: i % 5 === 0 ? 3 : 2,
      })),
    [],
  )

  return (
    <div className="stars-layer" aria-hidden>
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--d': s.d,
            '--delay': s.delay,
          }}
        />
      ))}
    </div>
  )
}

function Rain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${(i * 2.5) % 100}%`,
        duration: `${0.6 + (i % 5) * 0.15}s`,
        delay: `${(i % 20) * 0.05}s`,
      })),
    [],
  )

  return (
    <div className="rain-layer" aria-hidden>
      {drops.map((d) => (
        <span
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            animationDuration: d.duration,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function SkyEffects() {
  return (
    <>
      <div className="sky-orb sky-orb-1" aria-hidden />
      <div className="sky-orb sky-orb-2" aria-hidden />
      <div className="sky-orb sky-orb-3" aria-hidden />
      <Stars />
      <Rain />
      <div className="noise-overlay" aria-hidden />
    </>
  )
}
