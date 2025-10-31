import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VisitorData } from '../hooks/useVisitorData';
import { filterDataByTimeRange } from '../utils/dataUtils';

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

interface GraphProps {
  data: VisitorData[];
  selectedLocations: LocationSelection;
  timeRange: string;
}

const locationConfig = {
  stadelhofen: { color: '#3b82f6', label: 'Stadelhofen' },
  stockerhof: { color: '#ef4444', label: 'Stockerhof' },
  sihlcity: { color: '#10b981', label: 'Sihlcity' },
  puls5: { color: '#f59e0b', label: 'Puls 5' },
};

export default function Graph({ data, selectedLocations, timeRange }: GraphProps) {
  const filteredData = filterDataByTimeRange(data, timeRange);

  // Filter out entries with all nulls for cleaner display
  const cleanData = filteredData.filter(entry =>
    Object.keys(selectedLocations).some(loc =>
      selectedLocations[loc as keyof typeof selectedLocations] && entry[loc as keyof VisitorData] !== null
    )
  );

  return (
    <div className="graph-container">
      <h2>Visitor Trends</h2>
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
          {selectedLocations.stadelhofen && (
            <Line
              type="monotone"
              dataKey="stadelhofen"
              stroke={locationConfig.stadelhofen.color}
              name={locationConfig.stadelhofen.label}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {selectedLocations.stockerhof && (
            <Line
              type="monotone"
              dataKey="stockerhof"
              stroke={locationConfig.stockerhof.color}
              name={locationConfig.stockerhof.label}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {selectedLocations.sihlcity && (
            <Line
              type="monotone"
              dataKey="sihlcity"
              stroke={locationConfig.sihlcity.color}
              name={locationConfig.sihlcity.label}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {selectedLocations.puls5 && (
            <Line
              type="monotone"
              dataKey="puls5"
              stroke={locationConfig.puls5.color}
              name={locationConfig.puls5.label}
              dot={false}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
