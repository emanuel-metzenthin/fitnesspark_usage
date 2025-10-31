import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { VisitorData } from '../hooks/useVisitorData';
import type { Thresholds } from '../hooks/useThresholds';
import { filterDataByTimeRange } from '../utils/dataUtils';

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

type FocusedLocation = 'stadelhofen' | 'stockerhof' | 'sihlcity' | 'puls5' | null;

interface GraphProps {
  data: VisitorData[];
  selectedLocations: LocationSelection;
  timeRange: string;
  focusedLocation: FocusedLocation;
  thresholds: Thresholds;
}

const locationConfig = {
  stadelhofen: { label: 'Stadelhofen', defaultColor: '#3b82f6' },
  stockerhof: { label: 'Stockerhof', defaultColor: '#ef4444' },
  sihlcity: { label: 'Sihlcity', defaultColor: '#10b981' },
  puls5: { label: 'Puls 5', defaultColor: '#f59e0b' },
};

export default function Graph({ data, selectedLocations, timeRange, focusedLocation, thresholds }: GraphProps) {
  const filteredData = filterDataByTimeRange(data, timeRange);

  // Filter out entries with all nulls for cleaner display
  const cleanData = filteredData.filter(entry =>
    Object.keys(selectedLocations).some(loc =>
      selectedLocations[loc as keyof typeof selectedLocations] && entry[loc as keyof VisitorData] !== null
    )
  );

  const getLineColor = (location: keyof typeof locationConfig, isFocused: boolean) => {
    if (focusedLocation && !isFocused) {
      return '#d1d5db'; // Gray out if not focused
    }
    return locationConfig[location].defaultColor;
  };

  const renderLine = (location: keyof typeof locationConfig) => {
    const isFocused = focusedLocation === location || focusedLocation === null;
    const stroke = getLineColor(location, isFocused);

    return (
      <Line
        key={location}
        type="monotone"
        dataKey={location}
        stroke={stroke}
        name={locationConfig[location].label}
        dot={false}
        isAnimationActive={false}
        strokeWidth={isFocused ? 3 : 2}
        opacity={isFocused ? 1 : 0.3}
      />
    );
  };

  return (
    <div className="graph-container">
      <h2>Visitor Trends {focusedLocation && `- ${locationConfig[focusedLocation].label}`}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={cleanData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            interval={Math.floor(cleanData.length / 10)}
          />
          <YAxis />
          <Tooltip
            formatter={(value) => value === null ? 'N/A' : value}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />

          {/* Show threshold reference lines when a location is focused */}
          {focusedLocation && (
            <>
              <ReferenceLine
                y={thresholds[focusedLocation].yellow}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: 'Yellow', position: 'right', fill: '#f59e0b', fontSize: 12 }}
              />
              <ReferenceLine
                y={thresholds[focusedLocation].red}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: 'Red', position: 'right', fill: '#ef4444', fontSize: 12 }}
              />
            </>
          )}

          {selectedLocations.stadelhofen && renderLine('stadelhofen')}
          {selectedLocations.stockerhof && renderLine('stockerhof')}
          {selectedLocations.sihlcity && renderLine('sihlcity')}
          {selectedLocations.puls5 && renderLine('puls5')}
        </LineChart>
      </ResponsiveContainer>
      <p className="graph-hint">Click a stat card to focus on one location</p>
    </div>
  );
}
