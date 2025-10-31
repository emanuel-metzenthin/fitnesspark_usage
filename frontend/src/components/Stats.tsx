import type { VisitorData } from '../hooks/useVisitorData';
import type { Thresholds } from '../hooks/useThresholds';
import { TrendingUp, Clock } from 'lucide-react';
import { getOccupancyColor } from '../hooks/useThresholds';

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

type FocusedLocation = 'stadelhofen' | 'stockerhof' | 'sihlcity' | 'puls5' | null;

interface StatsProps {
  data: VisitorData[];
  selectedLocations: LocationSelection;
  thresholds: Thresholds;
  focusedLocation: FocusedLocation;
  onLocationClick: (location: FocusedLocation) => void;
}

export default function Stats({ data, selectedLocations, thresholds, focusedLocation, onLocationClick }: StatsProps) {
  const getLocationStats = (location: keyof Omit<VisitorData, 'timestamp'>) => {
    const values = data
      .map(d => d[location])
      .filter((v) => v !== null) as number[];

    if (values.length === 0) return null;

    const current = values[values.length - 1];
    const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const max = Math.max(...values);

    return { current, average, max };
  };

  const locations = [
    { key: 'stadelhofen', label: 'Stadelhofen' },
    { key: 'stockerhof', label: 'Stockerhof' },
    { key: 'sihlcity', label: 'Sihlcity' },
    { key: 'puls5', label: 'Puls 5' },
  ];

  const colorMap = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    gray: '#9ca3af',
  };

  return (
    <div className="stats-container">
      {locations.map(loc => {
        if (!selectedLocations[loc.key as keyof LocationSelection]) return null;

        const stats = getLocationStats(loc.key as keyof Omit<VisitorData, 'timestamp'>);
        if (!stats) return null;

        const locThresholds = thresholds[loc.key as keyof Thresholds];
        const occupancyColor = getOccupancyColor(stats.current, locThresholds.yellow, locThresholds.red);
        const borderColor = colorMap[occupancyColor];

        const isFocused = focusedLocation === loc.key;
        const handleClick = () => {
          onLocationClick(isFocused ? null : (loc.key as FocusedLocation));
        };

        return (
          <div
            key={loc.key}
            className={`stat-card ${isFocused ? 'focused' : ''}`}
            style={{ borderLeftColor: borderColor }}
            onClick={handleClick}
          >
            <div className="stat-header">
              <h3>{loc.label}</h3>
              <div className="stat-value" style={{ color: borderColor }}>
                <span className="occupancy-indicator" style={{ backgroundColor: borderColor }}>
                  {occupancyColor === 'green' && '🟢'}
                  {occupancyColor === 'yellow' && '🟡'}
                  {occupancyColor === 'red' && '🔴'}
                </span>
                <span>{stats.current}</span>
              </div>
            </div>
            <div className="stat-details">
              <div className="stat-item">
                <TrendingUp size={16} />
                <span>Avg: {stats.average}</span>
              </div>
              <div className="stat-item">
                <Clock size={16} />
                <span>Peak: {stats.max}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
