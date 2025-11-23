'use client';

import { useState, useEffect } from 'react';

export interface LiveVisitorData {
  timestamp: string;
  stadelhofen: number | null;
  stockerhof: number | null;
  sihlcity: number | null;
  puls5: number | null;
}

interface UseLiveVisitorsReturn {
  data: LiveVisitorData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000/api/visitors';
  }
  return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/api/visitors`;
};

export function useLiveVisitors(): UseLiveVisitorsReturn {
  const [data, setData] = useState<LiveVisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const result: LiveVisitorData = await response.json();
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch visitor data';
      setError(message);
      console.error('Error fetching live visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();

    // Refresh every 30 seconds
    const interval = setInterval(fetchVisitors, 30000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchVisitors };
}
