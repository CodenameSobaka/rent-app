// components/YandexMap.tsx
'use client'

import { useEffect, useRef } from 'react'
import { load } from '@2gis/mapgl'

interface Props {
  latitude?: number | null
  longitude?: number | null
  onClick?: (lat: number, lng: number, address?: string) => void
  height?: string
}

export default function YandexMap({ latitude, longitude, onClick, height = "420px" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_2GIS_MAP_KEY
    if (!key) return

    let map: any = null

    const initMap = async () => {
      try {
        const mapglAPI = await load()

        map = new mapglAPI.Map(mapRef.current!, {
          center: longitude && latitude ? [longitude, latitude] : [37.6173, 55.7558],
          zoom: latitude && longitude ? 16 : 13,
          key: key,
        })

        if (onClick) {
          map.on('click', async (e: any) => {
            const { lat, lng } = e.lngLat || {}

            if (typeof lat !== 'number' || typeof lng !== 'number') return

            try {
              const response = await fetch(
                `https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lng}&fields=items.point,items.address_name&key=${key}`
              )
              const data = await response.json()

              const address = data.result?.items?.[0]?.address_name || 
                             `Координаты: ${lat.toFixed(5)}, ${lng.toFixed(5)}`

              console.log("📍 Выбрано:", address)
              onClick(lat, lng, address)
            } catch (err) {
              console.error("Ошибка геокодирования:", err)
              onClick(lat, lng, `Координаты: ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            }
          })
        }

        // Маркер текущего положения
        if (latitude && longitude) {
          new mapglAPI.Marker(map, {
            coordinates: [longitude, latitude],
          })
        }

      } catch (err) {
        console.error("Ошибка инициализации 2GIS:", err)
      }
    }

    initMap()

    return () => {
      if (map) map.destroy()
    }
  }, [latitude, longitude, onClick])

  return (
    <div className="rounded-3xl overflow-hidden border border-gray-200" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}