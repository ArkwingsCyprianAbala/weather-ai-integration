# WeatherAI Forecast Studio

A polished weather dashboard built for the [Weather-AI technical assessment](https://weather-ai.co/docs). It consumes the Weather-AI REST API for live conditions, hourly and 7-day forecasts, AI-generated summaries, and usage quota — with location search so you can explore any city worldwide.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Weather-AI](https://img.shields.io/badge/API-Weather--AI-4a90d9)

## Features

- **Location search** — Find cities via geocoding, then fetch weather by coordinates (as required by the API)
- **Near me** — Browser geolocation with IP-based fallback (`/v1/weather-geo`)
- **Saved favorites** — Pin up to 6 locations in local storage
- **AI weather summary** — Toggleable Gemini insights (respects your AI quota; use `?ai=false` to save quota)
- **Metric / Imperial** — Switch units without reloading the page
- **Dynamic UI** — Sky theme adapts to conditions (clear, cloudy, storm, fog)
- **Secure API proxy** — API key stays on the server via Next.js Route Handlers
- **Usage meter** — Displays billing-period quota from `/v1/usage`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Weather-AI API](https://api.weather-ai.co) — weather, geo, usage
- [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) — city search (no extra key)

## Prerequisites

- Node.js 18+
- A Weather-AI API key (`wai_…`) from [weather-ai.co](https://weather-ai.co)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/weather-ai-integration.git
   cd weather-ai-integration
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and add your API key:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   WEATHER_AI_API_KEY=wai_your_actual_key
   ```

   > Use `WEATHER_AI_API_KEY` (server-only). Avoid committing `.env.local`.

   **Troubleshooting `401 Invalid or revoked API key`**

   - Keys are only shown once when created — generate a **new** key at [weather-ai.co](https://weather-ai.co) → Dashboard → API Keys.
   - Put it in `.env.local` as `WEATHER_AI_API_KEY=wai_...` (no quotes).
   - Restart the dev server after changing env vars (`Ctrl+C`, then `npm run dev`).

4. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. **Production build**

   ```bash
   npm run build
   npm start
   ```

## Deploy (Vercel recommended)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add environment variable: `WEATHER_AI_API_KEY` = your `wai_…` key.
4. Deploy — Vercel detects Next.js automatically.

Other hosts (Railway, Render, Netlify) work the same way: set `WEATHER_AI_API_KEY` and run `npm run build` + `npm start`.

## API routes (this app)

| Route | Proxies to |
|-------|------------|
| `GET /api/weather?lat=&lon=` | `/v1/weather` |
| `GET /api/weather-geo?ip=auto` | `/v1/weather-geo` |
| `GET /api/usage` | `/v1/usage` |
| `GET /api/geocode?q=` | Open-Meteo (search only) |

Query params for `/api/weather`: `days`, `units` (`metric` \| `imperial`), `ai` (`true` \| `false`), `lang`.

## Project structure

```
app/
  api/          # Server-side proxies to Weather-AI
  page.js       # Entry page
components/     # UI (search, hero, forecasts, AI card)
lib/            # API client, formatting, constants
```

## Assessment notes

This project demonstrates:

- Correct Bearer authentication and coordinate-based weather requests
- Thoughtful quota usage (optional AI, server-side key)
- Clean UX for exploring multiple locations
- README with setup and deployment instructions

## License

MIT — built as a technical assessment submission.
