const BASE = 'https://api.weather-ai.co'
const MAX_ATTEMPTS = 3

export function getApiKey() {
  const raw =
    process.env.WEATHER_AI_API_KEY ||
    process.env.NEXT_PUBLIC_WEATHER_API_KEY ||
    ''
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableNetworkError(err) {
  const code = err?.cause?.code ?? err?.code
  return (
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNREFUSED' ||
    code === 'UND_ERR_CONNECT_TIMEOUT' ||
    err?.message === 'fetch failed'
  )
}

export async function fetchWeatherAI(path, searchParams = {}) {
  const key = getApiKey()
  if (!key) {
    return {
      ok: false,
      status: 500,
      data: {
        error:
          'No API key configured. Add WEATHER_AI_API_KEY to .env.local and restart the dev server.',
      },
      headers: {},
    }
  }

  if (!key.startsWith('wai_')) {
    return {
      ok: false,
      status: 500,
      data: {
        error:
          'API key must start with wai_. Check WEATHER_AI_API_KEY in .env.local.',
      },
      headers: {},
    }
  }

  const url = new URL(`${BASE}${path}`)
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v))
    }
  })

  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${key}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(30_000),
      })

      let data
      try {
        data = await res.json()
      } catch {
        data = { error: 'Invalid response from Weather-AI API' }
      }

      if (res.status === 401) {
        data = {
          error:
            data?.error ||
            'Invalid or revoked API key. Create a new key at weather-ai.co (Dashboard → API Keys), update .env.local, then restart `npm run dev`.',
        }
      }

      const headers = {
        limit: res.headers.get('x-ratelimit-limit'),
        remaining: res.headers.get('x-ratelimit-remaining'),
        reset: res.headers.get('x-ratelimit-reset'),
        country: res.headers.get('x-country'),
        region: res.headers.get('x-region'),
        city: res.headers.get('x-city'),
      }

      return { ok: res.ok, status: res.status, data, headers }
    } catch (err) {
      lastError = err
      if (attempt < MAX_ATTEMPTS && isRetryableNetworkError(err)) {
        await sleep(400 * attempt)
        continue
      }
      break
    }
  }

  const code = lastError?.cause?.code ?? lastError?.code
  return {
    ok: false,
    status: 503,
    data: {
      error:
        code === 'ECONNRESET'
          ? 'Connection to Weather-AI was reset. Check your network and try again.'
          : `Could not reach Weather-AI API (${code || lastError?.message || 'network error'}).`,
    },
    headers: {},
  }
}
