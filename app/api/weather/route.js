import { NextResponse } from 'next/server'
import { fetchWeatherAI } from '@/lib/weather-api'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'lat and lon query parameters are required.' },
      { status: 400 },
    )
  }

  const days = searchParams.get('days') ?? '7'
  const units = searchParams.get('units') ?? 'metric'
  const ai = searchParams.get('ai') ?? 'true'
  const lang = searchParams.get('lang') ?? 'en'
  const endpoint = searchParams.get('endpoint') ?? 'weather'

  const path =
    endpoint === 'current'
      ? '/v1/current'
      : endpoint === 'hourly'
        ? '/v1/hourly'
        : '/v1/weather'

  const { ok, status, data, headers } = await fetchWeatherAI(path, {
    lat,
    lon,
    days,
    units,
    ai,
    lang,
  })

  return NextResponse.json(
    { ...data, _meta: { rateLimit: headers } },
    {
      status: ok ? 200 : status,
      headers: {
        'X-RateLimit-Remaining': headers.remaining ?? '',
        'X-RateLimit-Limit': headers.limit ?? '',
      },
    },
  )
}
