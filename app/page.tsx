'use client';

import { useState } from 'react';
import { useVisitorData } from '@/app/hooks/useVisitorData';
import { useLiveVisitors } from '@/app/hooks/useLiveVisitors';
import { THRESHOLDS } from '@/app/hooks/useThresholds';
import Graph from '@/app/components/Graph';
import Stats from '@/app/components/Stats';
import Filters from '@/app/components/Filters';

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

type FocusedLocation = 'stadelhofen' | 'stockerhof' | 'sihlcity' | 'puls5' | null;

export default function Home() {
  const { data, loading, error } = useVisitorData();
  const { data: liveData, loading: liveLoading } = useLiveVisitors();
  const [selectedLocations, setSelectedLocations] = useState<LocationSelection>({
    stadelhofen: true,
    stockerhof: true,
    sihlcity: true,
    puls5: true,
  });
  const [focusedLocation, setFocusedLocation] = useState<FocusedLocation>(null);
  const [timeRange, setTimeRange] = useState('24h');

  if (loading) {
    return (
      <div className="container loading">
        <div className="spinner"></div>
        <p>Loading gym visitor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error">
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🏋️ FitnessPark Zurich - Live Occupancy</h1>
        <p>Real-time visitor data for 4 locations</p>
      </header>

      <Filters
        selectedLocations={selectedLocations}
        onLocationChange={setSelectedLocations}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <Stats
        data={data}
        liveData={liveData}
        liveLoading={liveLoading}
        selectedLocations={selectedLocations}
        thresholds={THRESHOLDS}
        focusedLocation={focusedLocation}
        onLocationClick={setFocusedLocation}
      />

      <Graph
        data={data}
        selectedLocations={selectedLocations}
        timeRange={timeRange}
        focusedLocation={focusedLocation}
        thresholds={THRESHOLDS}
      />
    </div>
  );
}
