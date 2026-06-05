import { NextResponse } from 'next/server'
import { fetchWeatherAI } from '@/lib/weather-api'

export async function GET() {
  const { ok, status, data, headers } = await fetchWeatherAI('/v1/usage')

  return NextResponse.json(
    { ...data, _meta: { rateLimit: headers } },
    { status: ok ? 200 : status },
  )
}
