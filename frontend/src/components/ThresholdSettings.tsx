import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import type { Thresholds } from '../hooks/useThresholds';

interface ThresholdSettingsProps {
  thresholds: Thresholds;
  onUpdate: (thresholds: Thresholds) => void;
  onReset: () => void;
}

const locationNames = {
  stadelhofen: 'Stadelhofen',
  stockerhof: 'Stockerhof',
  sihlcity: 'Sihlcity',
  puls5: 'Puls 5',
};

export default function ThresholdSettings({
  thresholds,
  onUpdate,
  onReset,
}: ThresholdSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localThresholds, setLocalThresholds] = useState(thresholds);

  const handleLocationChange = (
    location: keyof Thresholds,
    field: 'yellow' | 'red',
    value: string
  ) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setLocalThresholds({
        ...localThresholds,
        [location]: {
          ...localThresholds[location],
          [field]: num,
        },
      });
    }
  };

  const handleSave = () => {
    onUpdate(localThresholds);
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset();
    setLocalThresholds(thresholds);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="threshold-open-btn"
        title="Set occupancy thresholds"
      >
        <Settings size={20} />
        Thresholds
      </button>
    );
  }

  return (
    <div className="threshold-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="threshold-modal" onClick={(e) => e.stopPropagation()}>
        <div className="threshold-modal-header">
          <h2>Occupancy Thresholds</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="threshold-close-btn"
          >
            <X size={24} />
          </button>
        </div>

        <div className="threshold-modal-content">
          <p className="threshold-description">
            Set yellow and red thresholds for each location. Use a traffic light
            system to easily interpret occupancy levels.
          </p>

          <div className="threshold-grid">
            {(Object.keys(locationNames) as Array<keyof typeof locationNames>).map(
              (location) => (
                <div key={location} className="threshold-location-card">
                  <h3>{locationNames[location]}</h3>

                  <div className="threshold-input-group">
                    <label>
                      <span className="threshold-label-text">
                        🟡 Yellow (Moderately Busy)
                      </span>
                      <input
                        type="number"
                        value={localThresholds[location].yellow}
                        onChange={(e) =>
                          handleLocationChange(location, 'yellow', e.target.value)
                        }
                        min="0"
                        max="300"
                      />
                    </label>
                  </div>

                  <div className="threshold-input-group">
                    <label>
                      <span className="threshold-label-text">
                        🔴 Red (Very Crowded)
                      </span>
                      <input
                        type="number"
                        value={localThresholds[location].red}
                        onChange={(e) =>
                          handleLocationChange(location, 'red', e.target.value)
                        }
                        min="0"
                        max="300"
                      />
                    </label>
                  </div>

                  <div className="threshold-legend">
                    <span className="legend-item">
                      <span className="legend-dot" style={{ color: '#10b981' }}>
                        ●
                      </span>
                      0–{localThresholds[location].yellow - 1}
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot" style={{ color: '#f59e0b' }}>
                        ●
                      </span>
                      {localThresholds[location].yellow}–{localThresholds[location].red - 1}
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot" style={{ color: '#ef4444' }}>
                        ●
                      </span>
                      {localThresholds[location].red}+
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="threshold-modal-footer">
          <button onClick={handleReset} className="threshold-btn-reset">
            Reset to Defaults
          </button>
          <div className="threshold-btn-group">
            <button onClick={() => setIsOpen(false)} className="threshold-btn-cancel">
              Cancel
            </button>
            <button onClick={handleSave} className="threshold-btn-save">
              Save Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
