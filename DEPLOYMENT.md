# FitnessPark Occupancy Tracker - Deployment Guide

## Overview

This project consists of two main parts:
- **Backend**: Python scraper that fetches gym visitor data and updates `visitors_data.csv`
- **Frontend**: Modern React dashboard with interactive graphs and filters (deployed on Vercel)

## Architecture

```
fitnesspark_usage/
├── main.py                    # Web scraper using Selenium
├── visitors_data.csv          # Central data store
├── .github/workflows/
│   └── fetch_data.yml        # GitHub Actions: Runs scraper every 15 mins
└── frontend/                  # React + Vite application
    ├── public/
    │   └── visitors_data.csv # Copied from root (auto-synced)
    ├── src/
    │   ├── components/       # Graph, Stats, Filters
    │   ├── hooks/           # useVisitorData
    │   └── utils/           # Data filtering logic
    ├── vercel.json          # Vercel configuration
    └── dist/                # Build output for deployment
```

## Data Flow

1. **Data Collection** (Every 15 minutes via GitHub Actions)
   - `main.py` runs on GitHub runners
   - Scrapes visitor counts from 4 Zurich FitnessPark locations
   - Appends data to `visitors_data.csv`
   - Copies CSV to `frontend/public/visitors_data.csv`
   - Commits changes back to the repository

2. **Data Serving** (Vercel Frontend)
   - React app fetches `visitors_data.csv` from the `/public` folder
   - Parses CSV client-side
   - Renders interactive charts and statistics

## Deployment Steps

### 1. Initial Setup

Clone the repository and install dependencies:

```bash
cd fitnesspark_usage
npm install --prefix frontend
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the frontend
cd frontend
vercel

# Follow the prompts to connect your GitHub account and project
```

#### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Choose the `frontend` directory as the root
6. Click "Deploy"

Vercel will automatically:
- Detect the Vite project
- Run `npm run build`
- Deploy the `dist` folder
- Set up automatic deployments on every push to `main`

### 3. GitHub Actions Setup (Scraper)

The scraper is already configured in `.github/workflows/fetch_data.yml` and will run automatically every 15 minutes.

**Important**: The GitHub runner needs to have Chrome installed for Selenium to work. The current setup uses the default ubuntu-latest image which includes Chrome.

**Note**: If you need to adjust the scraper schedule, edit the cron expression in `.github/workflows/fetch_data.yml`:
```yaml
schedule:
  - cron: '*/15 * * * *'  # Run every 15 minutes
```

### 4. Environment Variables

No environment variables are required for the basic setup. The app is fully static and client-side.

## Live Dashboard

Once deployed, your dashboard will be available at your Vercel domain:
- Example: `fitnesspark-dashboard.vercel.app`

### Features

- **Interactive Line Chart**: Multi-location visitor trends
- **Location Toggles**: Show/hide specific gyms
- **Time Range Filter**: View last 24h, 7 days, 30 days, or all-time data
- **Real-time Statistics**: Current occupancy, average visitors, peak times
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Auto-updating**: CSV data updates every 15 minutes (site needs refresh)

## Updating the Data Display

After the frontend is deployed, the CSV file will be automatically updated every 15 minutes by GitHub Actions.

To see fresh data:
1. Wait for the next scheduled run (every 15 minutes)
2. Refresh the dashboard page in your browser
3. The graph will update with the latest visitor counts

## Troubleshooting

### Data not updating on the dashboard
- Check if GitHub Actions workflow ran successfully
- Verify `visitors_data.csv` was updated in the repository
- Check browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Ensure frontend is pulling from the correct `visitors_data.csv` location

### Scraper fails in GitHub Actions
- Check the "Actions" tab in your GitHub repository
- Verify Selenium dependencies are properly installed
- Ensure Chrome/Chromium is available in the runner environment
- Check if the FitnessPark website structure has changed (XPath selectors may need updating)

### Build fails on Vercel
- Ensure `frontend/package.json` exists
- Check that all dependencies are properly listed
- Verify `frontend/public/visitors_data.csv` exists
- Review Vercel deployment logs for specific errors

## Performance Optimization

- **Bundle Size**: Recharts is split into a separate chunk (see `vite.config.ts`)
- **Data Loading**: CSV is parsed client-side to reduce server load
- **Caching**: Vite build includes cache-busting for automatic updates

## Future Enhancements

- Add dark mode toggle
- Implement local storage for user preferences
- Add capacity percentage visualization
- Real-time updates using WebSockets
- Peak hour heatmap analysis
- Export data as PDF or Excel
- Mobile app version

## Support & Feedback

For issues or feature requests, open an issue in your GitHub repository.
