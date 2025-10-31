import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VisitorData } from '../hooks/useVisitorData';
import type { Thresholds } from '../hooks/useThresholds';
import { filterDataByTimeRange } from '../utils/dataUtils';
import { getLineSegments } from '../utils/lineSegments';

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
  thresholds: Thresholds;
  focusedLocation: FocusedLocation;
}

const locationConfig = {
  stadelhofen: { label: 'Stadelhofen', defaultColor: '#3b82f6' },
  stockerhof: { label: 'Stockerhof', defaultColor: '#ef4444' },
  sihlcity: { label: 'Sihlcity', defaultColor: '#10b981' },
  puls5: { label: 'Puls 5', defaultColor: '#f59e0b' },
};

export default function Graph({ data, selectedLocations, timeRange, thresholds, focusedLocation }: GraphProps) {
  const filteredData = filterDataByTimeRange(data, timeRange);

  // Filter out entries with all nulls for cleaner display
  const cleanData = filteredData.filter(entry =>
    Object.keys(selectedLocations).some(loc =>
      selectedLocations[loc as keyof typeof selectedLocations] && entry[loc as keyof VisitorData] !== null
    )
  );

  const renderLineSegments = (location: keyof typeof locationConfig) => {
    const isFocused = focusedLocation === location || focusedLocation === null;
    const locationThresholds = thresholds[location];

    // Get segments with color transitions based on thresholds
    const segments = getLineSegments(cleanData, location, locationThresholds);

    return segments.map((segment, idx) => {
      // Create a subset of data for this segment
      const segmentData = cleanData.slice(segment.start, segment.end + 1);

      // For the first point, we need to include the previous point if it exists
      if (segment.start > 0) {
        segmentData.unshift(cleanData[segment.start - 1]);
      }

      const color = isFocused ? segment.color : '#d1d5db';
      const opacity = isFocused ? 1 : 0.3;
      const strokeWidth = isFocused ? 3 : 2;

      return (
        <Line
          key={`${location}-${idx}`}
          type="monotone"
          dataKey={location}
          data={segmentData}
          stroke={color}
          dot={false}
          isAnimationActive={false}
          strokeWidth={strokeWidth}
          opacity={opacity}
          connectNulls={false}
        />
      );
    });
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
          {selectedLocations.stadelhofen && renderLineSegments('stadelhofen')}
          {selectedLocations.stockerhof && renderLineSegments('stockerhof')}
          {selectedLocations.sihlcity && renderLineSegments('sihlcity')}
          {selectedLocations.puls5 && renderLineSegments('puls5')}
        </LineChart>
      </ResponsiveContainer>
      <p className="graph-hint">Click a stat card to focus on one location</p>
    </div>
  );
}
