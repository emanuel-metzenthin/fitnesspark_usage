interface LocationSelection {
  stadelhofen: boolean;
  stockerhof: boolean;
  sihlcity: boolean;
  puls5: boolean;
}

interface FiltersProps {
  selectedLocations: LocationSelection;
  onLocationChange: (locations: LocationSelection) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export default function Filters({
  selectedLocations,
  onLocationChange,
  timeRange,
  onTimeRangeChange,
}: FiltersProps) {
  const locations = [
    { key: 'stadelhofen', label: 'Stadelhofen', color: '#3b82f6' },
    { key: 'stockerhof', label: 'Stockerhof', color: '#ef4444' },
    { key: 'sihlcity', label: 'Sihlcity', color: '#10b981' },
    { key: 'puls5', label: 'Puls 5', color: '#f59e0b' },
  ];

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const handleLocationToggle = (key: string) => {
    const typedKey = key as keyof LocationSelection;
    onLocationChange({
      ...selectedLocations,
      [typedKey]: !selectedLocations[typedKey],
    });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <h3>Locations</h3>
        <div className="location-toggles">
          {locations.map(loc => (
            <label key={loc.key} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedLocations[loc.key as keyof LocationSelection]}
                onChange={() => handleLocationToggle(loc.key)}
              />
              <span
                className="color-dot"
                style={{ backgroundColor: loc.color }}
              ></span>
              {loc.label}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Time Range</h3>
        <div className="time-range-buttons">
          {timeRanges.map(range => (
            <button
              key={range.value}
              className={`time-btn ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => onTimeRangeChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
