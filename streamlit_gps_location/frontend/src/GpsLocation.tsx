import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useState, ReactElement } from "react"
// import useLocation from "./hooks/useLocation"
import { useGeolocated } from "react-geolocated"
import "./GpsLocation.css"

interface LocationData {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | object | null
  loading: boolean
}

interface GpsLocationProps extends ComponentProps {
  args: {
    buttonText: string
  }
}

function GpsLocation({ args }: GpsLocationProps): ReactElement {
  const buttonText = args.buttonText || "Get Location"

  const [locationData, setLocationData] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 3000, // Time to wait before error (10 seconds)
    maximumAge: 0, // Don't use cached position
  }

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    positionOptions: options,
    watchPosition: false,
    userDecisionTimeout: 5000,
  })

  const handleLocation = () => {
    if (!isGeolocationAvailable) {
      setLocationData({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      })
      return
    }

    if (!isGeolocationEnabled) {
      setLocationData({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: "Geolocation is disabled",
        loading: false,
      })
      return
    }

    if (positionError) {
      setLocationData({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: positionError,
        loading: false,
      })
      return
    }

    // Set loading state
    setLocationData({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: null,
      loading: true,
    })

    // Wait for location to be retrieved
    setTimeout(() => {
      if (!coords) {
        setLocationData({
          latitude: null,
          longitude: null,
          accuracy: null,
          error: null,
          loading: true,
        })
      } else {
        setLocationData({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          error: null,
          loading: false,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    console.log(locationData)
    Streamlit.setComponentValue(locationData)
  }, [locationData])

  // Ensure frame height is set correctly
  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  return (
    <div className="gps-container">
      <button className="gps-button" onClick={handleLocation}>
        {buttonText}
      </button>
    </div>
  )
}

export default withStreamlitConnection(GpsLocation)
