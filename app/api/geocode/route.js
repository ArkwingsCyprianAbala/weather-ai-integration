import { NextResponse } from 'next/server'

export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters.' },
      { status: 400 },
    )
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', q)
  url.searchParams.set('count', '8')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } })
  const data = await res.json()

  const results = (data.results ?? []).map((r) => ({
    id: `${r.latitude}-${r.longitude}`,
    name: r.name,
    region: r.admin1 ?? r.admin2 ?? '',
    country: r.country,
    countryCode: r.country_code,
    lat: r.latitude,
    lon: r.longitude,
    timezone: r.timezone,
    population: r.population,
  }))

  return NextResponse.json({ results })
}
