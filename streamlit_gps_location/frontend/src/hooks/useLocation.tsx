import React, { useEffect, useState, ReactElement } from "react"

export interface ILocation {
  lat: number | null
  lng: number | null
}

type UseLocationReturn = [
  ILocation | null,
  number | null,
  string | null,
  boolean, // Loading state
  () => void
]

const useLocation = (
  enabled: boolean,
  accuracyThreshold?: number,
  accuracyThresholdWaitTime?: number,
  options?: PositionOptions
): UseLocationReturn => {
  const [accuracy, setAccuracy] = React.useState<number | null>(null)
  const [location, setLocation] = React.useState<ILocation | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getLocation = () => {
    if (!enabled) {
      return
    }

    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    let timeout: NodeJS.Timeout | undefined
    const geoId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setAccuracy(position.coords.accuracy)

        if (
          accuracyThreshold == null ||
          position.coords.accuracy < accuracyThreshold
        ) {
          setLocation({ lat, lng })
          setLoading(false)
        }
      },
      (e) => {
        setError(e.message)
        setLoading(false)
      },
      options ?? { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
    )
    if (accuracyThreshold && accuracyThresholdWaitTime) {
      timeout = setTimeout(() => {
        if (!accuracy || accuracy < accuracyThreshold) {
          setError("Failed to reach desired accuracy")
          setLoading(false)
        }
      }, accuracyThresholdWaitTime * 1000)
    }
    return () => {
      window.navigator.geolocation.clearWatch(geoId)
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }

  if (!enabled) {
    return [null, null, null, loading, getLocation]
  }

  return [location, accuracy, error, loading, getLocation]
}

export default useLocation
