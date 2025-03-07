import streamlit as st
from streamlit_gps_location import gps_location

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run tests/example.py`

st.subheader("Component example")

# Create an instance of our component, and print its output value.
output = gps_location()
st.json(output)
