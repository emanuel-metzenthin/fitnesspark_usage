import streamlit as st
import pandas as pd
import altair as alt

st.title("Interactive Visitor Data Charts by Location")

@st.cache_data
def load_data():
    df = pd.read_csv("visitors_data.csv")
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    return df

df = load_data()

# List of location columns to plot
locations = ["stadelhofen", "stockerhof", "sihlcity", "puls5"]

charts = []  # Will store individual charts for combining later

# For each location, create a separate chart.
for loc in locations:
    st.subheader(f"Visitor Data for {loc.capitalize()}")
    
    # Create a DataFrame specific for this location.
    df_loc = df[["timestamp", loc]]
    
    # Create a selection that finds the nearest point based on the timestamp.
    nearest = alt.selection_single(
        nearest=True,
        on="mouseover",
        fields=["timestamp"],
        empty="none"
    )
    
    # Base line chart.
    base = alt.Chart(df_loc, title=loc).mark_line().encode(
        x=alt.X('timestamp:T', title='Time'),
        y=alt.Y(f'{loc}:Q', title='Number of Visitors'),
    )
    
    # Transparent selectors across the chart to capture mouse events.
    selectors = alt.Chart(df_loc).mark_point(opacity=0).encode(
        x='timestamp:T'
    ).add_selection(
        nearest
    )
    
    # Points highlight: display a dot when the mouse is near a timestamp.
    # Tooltip is configured to show date, hour and minute.
    points = base.mark_point(size=100, color='red').encode(
        opacity=alt.condition(nearest, alt.value(1), alt.value(0)),
    )
    
    # Vertical rule (cursor) that follows the mouse.
    cursor = alt.Chart(df_loc).mark_rule(color='gray').encode(
        x='timestamp:T',
        tooltip=alt.Tooltip('timestamp:T', title='Time', format='%Y-%m-%d %H:%M')
    ).transform_filter(
        nearest
    )
    
    # Combine all the components and add interactive zoom/pan.
    chart = alt.layer(
        base, selectors, points, cursor
    ).interactive()
    
    st.altair_chart(chart, use_container_width=True)
    charts.append(chart)

# Combine all charts vertically into a single chart layout
final_chart = alt.vconcat(*charts).configure_title(anchor='start')

# Save the combined chart as a standalone HTML file.
final_chart.save("index.html")
st.markdown("The combined chart has been saved as **chart.html** in your working directory.")
