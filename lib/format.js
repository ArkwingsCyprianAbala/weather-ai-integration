export function conditionLabel(code) {
  if (code == null) return 'Clear'
  return CONDITIONS_MAP[String(code)] ?? 'Clear'
}

const CONDITIONS_MAP = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

export function fmtHour(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function fmtDay(dateStr, index) {
  if (index === 0) return 'Today'
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function tempUnit(units) {
  return units === 'imperial' ? '°F' : '°C'
}

export function speedUnit(units) {
  return units === 'imperial' ? 'mph' : 'km/h'
}

export function locationLabel(loc) {
  if (!loc) return 'Unknown'
  const parts = [loc.name, loc.region, loc.country].filter(Boolean)
  return [...new Set(parts)].join(', ')
}

export function coordsLabel(lat, lon) {
  return `${Number(lat).toFixed(2)}°, ${Number(lon).toFixed(2)}°`
}

export function isNightIcon(iconUrl) {
  return typeof iconUrl === 'string' && iconUrl.includes('night')
}

export function skyTheme(conditionCode, iconUrl) {
  const code = Number(conditionCode)
  const night = isNightIcon(iconUrl)

  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return night ? 'storm-night' : 'storm-day'
  }
  if ([45, 48, 51, 53, 55].includes(code)) {
    return 'fog'
  }
  if ([2, 3].includes(code)) {
    return night ? 'cloud-night' : 'cloud-day'
  }
  return night ? 'clear-night' : 'clear-day'
}
