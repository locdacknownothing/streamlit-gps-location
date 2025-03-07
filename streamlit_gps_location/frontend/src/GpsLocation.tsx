import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useState, ReactElement } from "react"
import "./GpsLocation.css"

interface LocationData {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

interface GpsLocationProps extends ComponentProps {
  args: {
    buttonText: string
    callbackTriggered?: boolean
  }
}

function GpsLocation({ args }: GpsLocationProps): ReactElement {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  })

  const buttonText = args.buttonText || "Get Location"

  const getGpsLocation = () => {
    setLocation((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }))

    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }))
      return
    }

    // Function to handle successful location retrieval
    const handleSuccess = (position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      }
      setLocation(newLocation)

      // Send the location data back to Streamlit
      Streamlit.setComponentValue(newLocation)
    }

    // Function to handle errors
    const handleError = (error: GeolocationPositionError) => {
      let errorMessage: string

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for geolocation"
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable"
          break
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out"
          break
        default:
          errorMessage = "An unknown error occurred"
          break
      }

      const errorState = {
        latitude: null,
        longitude: null,
        accuracy: null,
        error: errorMessage,
        loading: false,
      }

      setLocation(errorState)

      // Send error state back to Streamlit
      Streamlit.setComponentValue(errorState)
    }

    // Options for geolocation
    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 10000, // Time to wait before error (5 seconds)
      maximumAge: 0, // Don"t use cached position
    }

    // Get the current position
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    )
  }

  // Initialize component and set frame height
  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  return (
    <div className="gps-container">
      <button className="gps-button" onClick={getGpsLocation}>
        {buttonText}
      </button>
    </div>
  )
}

export default withStreamlitConnection(GpsLocation)
