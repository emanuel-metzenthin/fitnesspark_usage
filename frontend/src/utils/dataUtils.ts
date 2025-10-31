import type { VisitorData } from '../hooks/useVisitorData';

export const filterDataByTimeRange = (data: VisitorData[], timeRange: string): VisitorData[] => {
  if (timeRange === 'all') return data;

  const now = new Date();
  let cutoffDate = new Date();

  switch (timeRange) {
    case '24h':
      cutoffDate.setHours(cutoffDate.getHours() - 24);
      break;
    case '7d':
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      break;
    case '30d':
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      break;
    default:
      return data;
  }

  return data.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= cutoffDate && entryDate <= now;
  });
};
