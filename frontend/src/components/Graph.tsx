import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VisitorData } from '../hooks/useVisitorData';
import type { Thresholds } from '../hooks/useThresholds';
import { filterDataByTimeRange } from '../utils/dataUtils';
import { getOccupancyColor, getColorHex } from '../hooks/useThresholds';

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
  thresholds: Thresholds;
}

const locationConfig = {
  stadelhofen: { label: 'Stadelhofen' },
  stockerhof: { label: 'Stockerhof' },
  sihlcity: { label: 'Sihlcity' },
  puls5: { label: 'Puls 5' },
};

export default function Graph({ data, selectedLocations, timeRange, thresholds }: GraphProps) {
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
              stroke={getColorHex(getOccupancyColor(
                cleanData[cleanData.length - 1]?.stadelhofen ?? null,
                thresholds.stadelhofen.yellow,
                thresholds.stadelhofen.red
              ))}
              name={`${locationConfig.stadelhofen.label}`}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          )}
          {selectedLocations.stockerhof && (
            <Line
              type="monotone"
              dataKey="stockerhof"
              stroke={getColorHex(getOccupancyColor(
                cleanData[cleanData.length - 1]?.stockerhof ?? null,
                thresholds.stockerhof.yellow,
                thresholds.stockerhof.red
              ))}
              name={`${locationConfig.stockerhof.label}`}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          )}
          {selectedLocations.sihlcity && (
            <Line
              type="monotone"
              dataKey="sihlcity"
              stroke={getColorHex(getOccupancyColor(
                cleanData[cleanData.length - 1]?.sihlcity ?? null,
                thresholds.sihlcity.yellow,
                thresholds.sihlcity.red
              ))}
              name={`${locationConfig.sihlcity.label}`}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          )}
          {selectedLocations.puls5 && (
            <Line
              type="monotone"
              dataKey="puls5"
              stroke={getColorHex(getOccupancyColor(
                cleanData[cleanData.length - 1]?.puls5 ?? null,
                thresholds.puls5.yellow,
                thresholds.puls5.red
              ))}
              name={`${locationConfig.puls5.label}`}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
