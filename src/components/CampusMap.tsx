"use client"

import { useEffect, useRef, useState } from "react"
import { useAppStore } from "@/context/AppStoreContext"
import type { Session } from "@/lib/mock-data"
import { LOCATION_COORDS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const LEAFLET_SCRIPT = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"

function loadLeaflet(): Promise<typeof window.L> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("No window"))
      return
    }
    if ((window as unknown as { L?: unknown }).L) {
      resolve((window as unknown as { L: typeof window.L }).L)
      return
    }
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = LEAFLET_CSS
    document.head.appendChild(link)
    const script = document.createElement("script")
    script.src = LEAFLET_SCRIPT
    script.async = true
    script.onload = () => {
      resolve((window as unknown as { L: typeof window.L }).L)
    }
    script.onerror = () => reject(new Error("Failed to load Leaflet"))
    document.head.appendChild(script)
  })
}

declare global {
  interface Window {
    L?: {
      map: (el: HTMLElement, opts: object) => { remove: () => void; invalidateSize: () => void }
      control: { zoom: (opts: object) => { addTo: (m: unknown) => unknown } }
      tileLayer: (url: string, opts: object) => { addTo: (m: unknown) => unknown }
      divIcon: (opts: object) => unknown
      marker: (latlng: [number, number], opts: object) => { addTo: (m: unknown) => { bindTooltip: (s: string, opts: object) => unknown } }
    }
  }
}

interface CampusMapProps {
  className?: string
  height?: string
  sessions?: Session[]
}

export function CampusMap({ className, height = "140px", sessions = [] }: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(false)
  const { store } = useAppStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const mapRef = useRef<{ remove: () => void; invalidateSize: () => void } | null>(null)

  useEffect(() => {
    if (!mounted || !containerRef.current || typeof window === "undefined" || error) return

    loadLeaflet()
      .then((L) => {
        if (!containerRef.current || !L) return
        const defaultCenter = LOCATION_COORDS[store.defaultLocation] ?? [43.665, -79.395]
        const map = L.map(containerRef.current, {
          center: defaultCenter,
          zoom: 16,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: true,
          attributionControl: false,
        })
        L.control.zoom({ position: "bottomright" }).addTo(map)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map)

        const defaultIcon = L.divIcon({
          className: "study-buddy-marker study-buddy-marker-default",
          html: `<span style="width:12px;height:12px;border-radius:50%;background:#0ea5e9;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);display:block;"></span>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        const sessionIcon = L.divIcon({
          className: "study-buddy-marker study-buddy-marker-session",
          html: `<span style="width:10px;height:10px;border-radius:50%;background:#059669;border:2px solid white;box-shadow:0 1px 2px rgba(0,0,0,0.25);display:block;"></span>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        })

        const defaultCoord = LOCATION_COORDS[store.defaultLocation]
        if (defaultCoord) {
          L.marker(defaultCoord, { icon: defaultIcon })
            .addTo(map)
            .bindTooltip(store.defaultLocation, {
              permanent: false,
              direction: "top",
              className: "study-buddy-tooltip",
            })
        }
        const addedLocs = new Set<string>()
        sessions.forEach((session) => {
          const coord = LOCATION_COORDS[session.location]
          if (coord && !addedLocs.has(session.location)) {
            addedLocs.add(session.location)
            L.marker(coord, { icon: sessionIcon })
              .addTo(map)
              .bindTooltip(`${session.location} · ${session.course}`, {
                permanent: false,
                direction: "top",
                className: "study-buddy-tooltip",
              })
          }
        })
        map.invalidateSize()
        mapRef.current = map
      })
      .catch(() => setError(true))

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mounted, store.defaultLocation, error, sessions])

  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center",
          className
        )}
        style={{ height }}
      >
        <p className="text-slate-400 text-sm">Loading map...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center",
          className
        )}
        style={{ height }}
      >
        <p className="text-slate-400 text-sm">Campus map · Enable network to load</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn("rounded-xl overflow-hidden border border-slate-200 bg-slate-100", className)}
      style={{ height }}
    />
  )
}
