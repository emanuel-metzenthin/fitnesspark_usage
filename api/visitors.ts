// @ts-ignore - Vercel Node types will be available at runtime
import { VercelRequest, VercelResponse } from '@vercel/node';

interface VisitorResponse {
  timestamp: string;
  stadelhofen: number | null;
  stockerhof: number | null;
  sihlcity: number | null;
  puls5: number | null;
  error?: string;
}

const LOCATIONS = [
  { name: 'stadelhofen', url: 'https://www.fitnesspark.ch/fitnessparks/zuerich-stadelhofen/ueber-den-park/' },
  { name: 'stockerhof', url: 'https://www.fitnesspark.ch/fitnessparks/zuerich-stockerhof/ueber-den-park/' },
  { name: 'sihlcity', url: 'https://www.fitnesspark.ch/fitnessparks/zuerich-sihlcity/ueber-den-park/' },
  { name: 'puls5', url: 'https://www.fitnesspark.ch/fitnessparks/puls-5-zuerich/ueber-den-park/' },
];

async function fetchVisitorCount(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Parse HTML to find visitor count
    const match = html.match(/nav-item-visitors["\s>]*[^>]*>\s*<span[^>]*>(\d+)<\/span>/);

    if (match && match[1]) {
      const count = parseInt(match[1], 10);
      return isNaN(count) ? null : count;
    }

    console.error(`Could not parse visitor count from ${url}`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
): Promise<void> {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({
      timestamp: new Date().toISOString(),
      stadelhofen: null,
      stockerhof: null,
      sihlcity: null,
      puls5: null,
      error: 'Method not allowed',
    });
    return;
  }

  try {
    const results: VisitorResponse = {
      timestamp: new Date().toISOString(),
      stadelhofen: null,
      stockerhof: null,
      sihlcity: null,
      puls5: null,
    };

    // Fetch all visitor counts in parallel
    const fetchPromises = LOCATIONS.map(async (location) => {
      const count = await fetchVisitorCount(location.url);
      (results as any)[location.name] = count;
    });

    await Promise.all(fetchPromises);

    response.status(200).json(results);
  } catch (error) {
    console.error('Error in handler:', error);
    response.status(500).json({
      timestamp: new Date().toISOString(),
      stadelhofen: null,
      stockerhof: null,
      sihlcity: null,
      puls5: null,
      error: 'Failed to fetch visitor data',
    });
  }
}
