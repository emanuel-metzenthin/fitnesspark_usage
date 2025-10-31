import type { VisitorData } from '../hooks/useVisitorData';
import type { Thresholds } from '../hooks/useThresholds';
import { getOccupancyColor, getColorHex } from '../hooks/useThresholds';

export interface LineSegment {
  start: number;
  end: number;
  color: string;
}

export const getLineSegments = (
  data: VisitorData[],
  location: keyof Omit<VisitorData, 'timestamp'>,
  thresholds: Thresholds[keyof Thresholds]
): LineSegment[] => {
  const segments: LineSegment[] = [];
  let currentSegment: LineSegment | null = null;

  data.forEach((entry, index) => {
    const value = entry[location];
    if (value === null) return;

    const color = getColorHex(getOccupancyColor(value, thresholds.yellow, thresholds.red));

    if (!currentSegment) {
      currentSegment = { start: index, end: index, color };
    } else if (currentSegment.color === color) {
      currentSegment.end = index;
    } else {
      segments.push(currentSegment);
      currentSegment = { start: index, end: index, color };
    }
  });

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
};
