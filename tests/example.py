import streamlit as st
from streamlit_gps_location import gps_location_button

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run streamlit_gps_location/example.py`

# Define a function to handle location data
def process_location(location_data):
    if location_data and location_data.get("latitude") and not location_data.get("loading"):
        st.success("Location successfully retrieved!")
        st.write(f"Latitude: {location_data['latitude']}")
        st.write(f"Longitude: {location_data['longitude']}")
        st.write(f"Accuracy: {location_data['accuracy']} meters")
        
        # Display on a map
        map_data = {
            "lat": [location_data["latitude"]],
            "lon": [location_data["longitude"]]
        }
        st.map(map_data)
    
    # Show error if there was one
    if location_data and location_data.get("error"):
        st.error(f"Error getting location: {location_data['error']}")

# Initialize session state to track if callback has been triggered
if 'location_callback_triggered' not in st.session_state:
    st.session_state.location_callback_triggered = False

# Get location with a custom button text
user_location = gps_location_button(
    buttonText="Get my location"
)

# Process location data when it changes
if user_location and not st.session_state.location_callback_triggered:
    process_location(user_location)
    st.session_state.location_callback_triggered = True
