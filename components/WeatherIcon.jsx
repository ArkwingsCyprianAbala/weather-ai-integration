'use client'

/* eslint-disable @next/next/no-img-element -- external Weather-AI CDN icons */

const FALLBACK =
  'https://cdn.weather-ai.co/icons/default/0_clear_day.svg'

export default function WeatherIcon({ src, alt = 'Weather', className = 'h-8 w-8' }) {
  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      className={`object-contain ${className}`}
      onError={(e) => {
        e.currentTarget.src = FALLBACK
      }}
    />
  )
}
