import { useState } from 'react'
import { useVisitorData } from './hooks/useVisitorData'
import { useThresholds } from './hooks/useThresholds'
import Graph from './components/Graph'
import Stats from './components/Stats'
import Filters from './components/Filters'
import ThresholdSettings from './components/ThresholdSettings'
import './App.css'

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

function App() {
  const { data, loading, error } = useVisitorData()
  const { thresholds, updateThresholds, resetToDefaults, loaded: thresholdsLoaded } = useThresholds()
  const [selectedLocations, setSelectedLocations] = useState<LocationSelection>({
    stadelhofen: true,
    stockerhof: true,
    sihlcity: true,
    puls5: true,
  })
  const [timeRange, setTimeRange] = useState('all')

  if (loading) {
    return (
      <div className="container loading">
        <div className="spinner"></div>
        <p>Loading gym visitor data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container error">
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🏋️ FitnessPark Zurich - Live Occupancy</h1>
            <p>Real-time visitor data for 4 locations</p>
          </div>
          {thresholdsLoaded && (
            <ThresholdSettings
              thresholds={thresholds}
              onUpdate={updateThresholds}
              onReset={resetToDefaults}
            />
          )}
        </div>
      </header>

      <Filters
        selectedLocations={selectedLocations}
        onLocationChange={setSelectedLocations}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <Stats data={data} selectedLocations={selectedLocations} thresholds={thresholds} />

      <Graph
        data={data}
        selectedLocations={selectedLocations}
        timeRange={timeRange}
        thresholds={thresholds}
      />
    </div>
  )
}

export default App
