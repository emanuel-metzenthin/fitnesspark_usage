import { useState, useEffect } from 'react';

export interface VisitorData {
  timestamp: string;
  stadelhofen: number | null;
  stockerhof: number | null;
  sihlcity: number | null;
  puls5: number | null;
}

export interface ParsedData {
  data: VisitorData[];
  loading: boolean;
  error: string | null;
}

export const useVisitorData = (): ParsedData => {
  const [data, setData] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/visitors_data.csv');
        const text = await response.text();
        const lines = text.trim().split('\n');

        const parsed: VisitorData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length < 5) continue;

          const timestamp = parts[0];
          const parseNumber = (val: string): number | null => {
            const trimmed = val.trim();
            if (!trimmed || trimmed === 'AKTUELLE BESUCHERZAHL KONNTE NICHT ABGERUFEN WERDEN') {
              return null;
            }
            const num = parseInt(trimmed, 10);
            return isNaN(num) ? null : num;
          };

          parsed.push({
            timestamp,
            stadelhofen: parseNumber(parts[1]),
            stockerhof: parseNumber(parts[2]),
            sihlcity: parseNumber(parts[3]),
            puls5: parseNumber(parts[4]),
          });
        }

        setData(parsed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
