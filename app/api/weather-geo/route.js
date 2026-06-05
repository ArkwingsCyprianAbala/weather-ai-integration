import { NextResponse } from 'next/server'
import { fetchWeatherAI } from '@/lib/weather-api'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get('ip') ?? 'auto'
  const days = searchParams.get('days') ?? '7'
  const units = searchParams.get('units') ?? 'metric'
  const ai = searchParams.get('ai') ?? 'true'

  const { ok, status, data, headers } = await fetchWeatherAI('/v1/weather-geo', {
    ip,
    days,
    units,
    ai,
    lat: searchParams.get('lat'),
    lon: searchParams.get('lon'),
  })

  const geo = {
    country: headers.country,
    region: headers.region,
    city: headers.city,
  }

  return NextResponse.json(
    { ...data, _geo: geo, _meta: { rateLimit: headers } },
    { status: ok ? 200 : status },
  )
}
