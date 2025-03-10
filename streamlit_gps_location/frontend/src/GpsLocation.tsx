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
  error: string | null
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
    loading: true,
  })

  // // Function to handle successful location retrieval
  // const handleSuccess = (position: GeolocationPosition) => {
  //   const newLocation = {
  //     latitude: position.coords.latitude,
  //     longitude: position.coords.longitude,
  //     accuracy: position.coords.accuracy,
  //     error: null,
  //     loading: false,
  //   }
  //   setLocation(newLocation)

  //   // Send the location data back to Streamlit
  //   Streamlit.setComponentValue(newLocation)
  // }

  // // Function to handle errors
  // const handleError = (error: GeolocationPositionError) => {
  //   let errorMessage: string

  //   switch (error.code) {
  //     case error.PERMISSION_DENIED:
  //       errorMessage = "User denied the request for geolocation"
  //       break
  //     case error.POSITION_UNAVAILABLE:
  //       errorMessage = "Location information is unavailable"
  //       break
  //     case error.TIMEOUT:
  //       errorMessage = "The request to get user location timed out"
  //       break
  //     default:
  //       errorMessage = "An unknown error occurred"
  //       break
  //   }

  //   const errorState = {
  //     latitude: null,
  //     longitude: null,
  //     accuracy: null,
  //     error: errorMessage,
  //     loading: false,
  //   }

  //   setLocation(errorState)

  //   // Send error state back to Streamlit
  //   Streamlit.setComponentValue(errorState)
  // }

  // // Options for geolocation
  // const options: PositionOptions = {
  //   enableHighAccuracy: true, // Use GPS if available
  //   timeout: 10000, // Time to wait before error (5 seconds)
  //   maximumAge: 0, // Don"t use cached position
  // }

  // // Get the current position
  // navigator.geolocation.getCurrentPosition(
  //   handleSuccess,
  //   handleError,
  //   options
  // )
  // }

  const options: PositionOptions = {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 10000, // Time to wait before error (10 seconds)
    maximumAge: 0, // Don"t use cached position
  }

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: options,
      watchPosition: false,
      userDecisionTimeout: 5000,
      // suppressLocationOnMount: true,
    })

  const handleLocation = () => {
    if (!isGeolocationAvailable) {
      setLocationData((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser",
      }))
      return
    }

    if (!isGeolocationEnabled) {
      setLocationData((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is disabled",
      }))
      return
    }

    if (!getPosition) {
      setLocationData((prev) => ({
        ...prev,
        loading: false,
        error: "Unable to retrieve location at this time.",
      }))
      return
    }

    // Set loading state
    setLocationData((prev) => ({ ...prev, loading: true, error: null }))

    // getPosition()

    // Wait for location to be retrieved
    setTimeout(() => {
      if (!coords) {
        setLocationData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to retrieve location.",
        }))
      } else {
        setLocationData({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          error: null,
          loading: false,
        })
      }
    }, 500)
  }

  useEffect(() => {
    if (!locationData.loading) {
      Streamlit.setComponentValue(locationData)
    }
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
