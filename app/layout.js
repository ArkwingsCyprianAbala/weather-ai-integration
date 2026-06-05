import './globals.css'

export const metadata = {
  title: 'WeatherAI Forecast Studio',
  description:
    'A premium weather experience with location search, AI insights, and cinematic forecasts — powered by Weather-AI.',
  openGraph: {
    title: 'WeatherAI Forecast Studio',
    description: 'Real-time weather and AI insights from the Weather-AI API',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
