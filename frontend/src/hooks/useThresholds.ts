import { useState } from 'react';

export interface Thresholds {
  stadelhofen: { yellow: number; red: number };
  stockerhof: { yellow: number; red: number };
  sihlcity: { yellow: number; red: number };
  puls5: { yellow: number; red: number };
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  stadelhofen: { yellow: 130, red: 180 },
  stockerhof: { yellow: 120, red: 200 },
  sihlcity: { yellow: 80, red: 150 },
  puls5: { yellow: 110, red: 190 },
};

export const useThresholds = () => {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

  const updateThresholds = (newThresholds: Thresholds) => {
    setThresholds(newThresholds);
  };

  const resetToDefaults = () => {
    setThresholds(DEFAULT_THRESHOLDS);
  };

  return { thresholds, updateThresholds, resetToDefaults };
};

// Helper function to determine color based on value and thresholds
export const getOccupancyColor = (
  value: number | null,
  yellow: number,
  red: number
): 'green' | 'yellow' | 'red' | 'gray' => {
  if (value === null) return 'gray';
  if (value >= red) return 'red';
  if (value >= yellow) return 'yellow';
  return 'green';
};

// Get the hex color for chart display
export const getColorHex = (color: 'green' | 'yellow' | 'red' | 'gray'): string => {
  const colors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    gray: '#9ca3af',
  };
  return colors[color];
};
