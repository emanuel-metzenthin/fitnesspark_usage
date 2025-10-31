import type { VisitorData } from '../hooks/useVisitorData';
import { Users, TrendingUp, Clock } from 'lucide-react';

interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

interface StatsProps {
  data: VisitorData[];
  selectedLocations: LocationSelection;
}

export default function Stats({ data, selectedLocations }: StatsProps) {
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
    { key: 'stadelhofen', label: 'Stadelhofen', color: '#3b82f6' },
    { key: 'stockerhof', label: 'Stockerhof', color: '#ef4444' },
    { key: 'sihlcity', label: 'Sihlcity', color: '#10b981' },
    { key: 'puls5', label: 'Puls 5', color: '#f59e0b' },
  ];

  return (
    <div className="stats-container">
      {locations.map(loc => {
        if (!selectedLocations[loc.key as keyof LocationSelection]) return null;

        const stats = getLocationStats(loc.key as keyof Omit<VisitorData, 'timestamp'>);
        if (!stats) return null;

        return (
          <div key={loc.key} className="stat-card" style={{ borderLeftColor: loc.color }}>
            <div className="stat-header">
              <h3>{loc.label}</h3>
              <div className="stat-value">
                <Users size={20} />
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
