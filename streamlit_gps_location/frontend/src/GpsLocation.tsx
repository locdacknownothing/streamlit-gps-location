import {
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { useEffect, useState, ReactElement } from "react"
import "./GpsLocation.css"

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

function GpsLocation(): ReactElement {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    Streamlit.setComponentValue(location)
  }, [location]);

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    // Function to handle successful location retrieval
    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    // Function to handle errors
    const handleError = (error: GeolocationPositionError) => {
      let errorMessage: string;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "User denied the request for geolocation";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out";
          break;
        default:
          errorMessage = "An unknown error occurred";
          break;
      }
      
      setLocation(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    // Options for geolocation
    const options: PositionOptions = {
      enableHighAccuracy: true, // Use GPS if available
      timeout: 5000,           // Time to wait before error (5 seconds)
      maximumAge: 0            // Don"t use cached position
    };

    // Get the current position
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Clean up by removing the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return <div style={{"display": "none"}}></div>

  // return (
  //   <div className="gps-container">
  //     <h2 className="gps-title">GPS Location</h2>
      
  //     {location.loading && (
  //       <div className="loading-spinner">
  //         <div className="spinner"></div>
  //         <p>Loading location data...</p>
  //       </div>
  //     )}
      
  //     {location.error && (
  //       <div className="error-container">
  //         <div className="error-icon">!</div>
  //         <p className="error-message">Error: {location.error}</p>
  //       </div>
  //     )}
      
  //     {!location.loading && !location.error && (
  //       <div className="location-info">
  //         <div className="location-item">
  //           <span className="location-label">Latitude:</span>
  //           <span className="location-value">{location.latitude}</span>
  //         </div>
  //         <div className="location-item">
  //           <span className="location-label">Longitude:</span>
  //           <span className="location-value">{location.longitude}</span>
  //         </div>
  //         <div className="location-item">
  //           <span className="location-label">Accuracy:</span>
  //           <span className="location-value">{location.accuracy} meters</span>
  //         </div>
          
  //         {location.latitude && location.longitude && (
  //           <div className="maps-link-container">
  //             <a 
  //               className="maps-link"
  //               href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               View on Google Maps
  //             </a>
  //           </div>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default withStreamlitConnection(GpsLocation);
