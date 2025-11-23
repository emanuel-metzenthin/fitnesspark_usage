import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { list, put, get } from '@vercel/blob';


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
  let browser = null;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for the visitor count to load (not show "Loading...")
    await page.waitForFunction(
      () => {
        const span = document.querySelector("div.nav-item-visitors span");
        return span && span.textContent && span.textContent.trim() !== 'Loading...';
      },
      { timeout: 20000 }
    );

    // Extract the visitor count
    const visitorText = await page.evaluate(() => {
      const span = document.querySelector("div.nav-item-visitors span");
      return span?.textContent?.trim() || null;
    });

    console.log(`Fetched visitor count from ${url}:`, visitorText);

    if (visitorText) {
      const count = parseInt(visitorText, 10);
      return isNaN(count) ? null : count;
    }

    console.error(`Could not parse visitor count from ${url}`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET(request: NextRequest) {
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

    // Save data to Vercel Blob Storage
    try {
      const csvFileName = 'visitors_data.csv';

      // Try to get existing CSV file
      let csvContent = '';
      try {
        const existingBlob = await get(csvFileName);
        if (existingBlob) {
          csvContent = await existingBlob.text();
        }
      } catch (error) {
        console.log('CSV file does not exist yet, creating new one');
      }

      // Append new row
      const newRow = `${results.timestamp},${results.stadelhofen},${results.stockerhof},${results.sihlcity},${results.puls5}\n`;
      csvContent += newRow;

      // Upload updated CSV to Blob Storage
      await put(csvFileName, csvContent, {
        contentType: 'text/csv',
        access: 'public',
      });

      console.log('Visitor data saved to Blob Storage');
    } catch (error) {
      console.error('Error saving to Blob Storage:', error);
    }

    return NextResponse.json(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        stadelhofen: null,
        stockerhof: null,
        sihlcity: null,
        puls5: null,
        error: 'Failed to fetch visitor data',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
