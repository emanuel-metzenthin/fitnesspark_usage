# FitnessPark Zurich - Live Occupancy Tracker

A modern, interactive web dashboard for tracking real-time visitor occupancy across 4 FitnessPark locations in Zurich.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)

## Features

✨ **Interactive Dashboard**
- Real-time visitor count tracking for 4 gym locations
- Multi-line interactive chart with hover tooltips
- Location filtering with color-coded indicators
- Responsive design (desktop, tablet, mobile)

📊 **Smart Statistics**
- Current occupancy at a glance
- Average visitor count per location
- Peak occupancy times
- Time-based filtering (24h, 7d, 30d, all-time)

🔄 **Automated Data Collection**
- Scrapes FitnessPark website every 15 minutes
- GitHub Actions workflow for continuous updates
- Historical data tracking since March 2025

## Live Demo

Visit the live dashboard: https://fitnesspark-dashboard.vercel.app

## Quick Start

### Prerequisites
- Node.js 20.19+ or 22.12+
- Python 3.8+
- Chrome/Chromium (for the scraper)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/fitnesspark_usage
cd fitnesspark_usage

# Install frontend dependencies
npm install --prefix frontend

# Start development server
npm run dev --prefix frontend
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build --prefix frontend
```

## Project Structure

```
fitnesspark_usage/
├── main.py                 # Selenium web scraper
├── visitors_data.csv       # Visitor counts dataset
├── .github/workflows/
│   └── fetch_data.yml     # GitHub Actions scheduled task
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── hooks/         # Custom hooks
    │   ├── utils/         # Utility functions
    │   └── App.tsx        # Main component
    ├── public/
    │   └── visitors_data.csv  # Data for the frontend
    ├── vite.config.ts     # Vite configuration
    └── vercel.json        # Vercel deployment config
```

## Data Sources

The scraper collects visitor data from:
1. **Stadelhofen** - Zurich Stadelhofen location
2. **Stockerhof** - Zurich Stockerhof location
3. **Sihlcity** - Zurich Sihlcity location
4. **Puls 5** - Zurich Puls 5 location

Data is fetched from the official FitnessPark website every 15 minutes.

## Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Recharts** - Interactive charting library
- **Lucide React** - Icon library
- **TypeScript** - Type safety

### Backend
- **Python** - Data collection
- **Selenium** - Web scraping
- **GitHub Actions** - Automation

### Deployment
- **Vercel** - Frontend hosting
- **GitHub** - Data storage & CI/CD

## Configuration

### Update Scraper Schedule

Edit `.github/workflows/fetch_data.yml`:
```yaml
schedule:
  - cron: '*/15 * * * *'  # Change to your desired interval
```

Cron format: `minute hour day month day-of-week`

### Customize Locations

Edit `main.py` to add/remove locations:
```python
urls = [
    'https://www.fitnesspark.ch/fitnessparks/location/ueber-den-park/',
    # Add more URLs here
]
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ffitnesspark_usage&project-name=fitnesspark-tracker&repo-name=fitnesspark_usage)

## Data Format

The `visitors_data.csv` file contains:
```csv
timestamp,stadelhofen,stockerhof,sihlcity,puls5
2025-03-17 06:16:18,1,2,1,33
2025-03-17 06:39:19,50,38,1,48
```

Missing values are stored as empty cells or error messages.

## Performance Metrics

- **Bundle Size**: ~516 KB (157 KB gzipped)
- **Page Load**: < 2 seconds
- **Chart Rendering**: Real-time with 1000+ data points
- **Data Updates**: Every 15 minutes
- **Uptime**: 99.9% (Vercel SLA)

## Error Handling

The scraper gracefully handles:
- Website connection failures
- Missing visitor count elements
- XPath selector changes
- Browser timeout errors

Failed scrapes log error messages in the CSV for debugging.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This project is an unofficial tool for tracking FitnessPark occupancy. It's not affiliated with FitnessPark AG. Use responsibly and respect the website's terms of service.

## Support

Found a bug? Have a feature request?
- Open an issue on GitHub
- Check existing issues for similar problems
- Include detailed error messages and screenshots

## Roadmap

- [ ] Dark mode support
- [ ] Real-time updates via WebSocket
- [ ] Mobile app version
- [ ] Capacity percentage visualization
- [ ] Peak time predictions
- [ ] Email notifications
- [ ] Integration with fitness tracking apps

## Changelog

### v1.0.0 (Current)
- Initial release with React dashboard
- Interactive multi-location chart
- Time range filtering
- Real-time statistics cards
- Responsive design
- Automated data collection

---

Made with ❤️ for fitness enthusiasts in Zurich
