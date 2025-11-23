import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const csvFileName = 'visitors_data.csv';

    // Get the blob file metadata
    const blobInfo = await head(csvFileName);

    if (!blobInfo) {
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      );
    }

    // Fetch the CSV content from the blob URL
    const response = await fetch(blobInfo.url);
    const csvContent = await response.text();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching CSV from Blob Storage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CSV data' },
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
