import { RemixBrowser } from '@remix-run/react'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { Metric, ReportCallback } from 'web-vitals'

import { logStayCurious } from 'curious'

const hydrate = () => {
  logStayCurious()
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1)
}

reportWebVitals(sendToVercelAnalytics)

function getConnectionSpeed() {
  return 'connection' in navigator &&
    typeof navigator.connection === 'object' &&
    navigator.connection !== null &&
    'effectiveType' in navigator.connection &&
    typeof navigator.connection.effectiveType === 'string'
    ? navigator.connection.effectiveType
    : ''
}

function sendToVercelAnalytics(metric: Metric) {
  const analyticsId = window.env.VERCEL_ANALYTICS_ID
  if (!analyticsId) return
  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }
  const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'
  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: 'application/x-www-form-urlencoded',
  })
  if (navigator.sendBeacon) navigator.sendBeacon(vitalsUrl, blob)
  else
    void fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
}

function reportWebVitals(onPerfEntry: ReportCallback) {
  if (onPerfEntry && onPerfEntry instanceof Function)
    void import('web-vitals').then(
      ({ onCLS, onFCP, onFID, onINP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry)
        onFCP(onPerfEntry)
        onFID(onPerfEntry)
        onINP(onPerfEntry)
        onLCP(onPerfEntry)
        onTTFB(onPerfEntry)
        return null
      },
    )
}
