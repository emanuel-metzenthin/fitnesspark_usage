# Quick Start Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Choose these settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

Vercel will automatically:
- Detect Node.js and install dependencies
- Build the React frontend
- Deploy it globally
- Set up automatic deployments on every push

**Your dashboard is now live!** 🎉

### Step 2: Verify GitHub Actions

1. Go to your GitHub repository
2. Click "Actions" tab
3. Verify "Fetch Visitors Data" workflow is running
4. It should run every 15 minutes automatically

### Step 3: (Optional) Customize

**Update scraper schedule** (if needed):
- Edit `.github/workflows/fetch_data.yml`
- Change the `cron` schedule
- Default: every 15 minutes

**Add/remove gym locations**:
- Edit `main.py`
- Add/remove URLs from the `urls` list
- Update column names in `frontend/src/hooks/useVisitorData.ts`

---

## 📊 Your Dashboard Features

✅ **Real-time Charts** - See visitor trends across all locations
✅ **Interactive Filters** - Toggle locations on/off, filter by time range
✅ **Live Statistics** - Current occupancy, average, and peak times
✅ **Responsive Design** - Works on desktop, tablet, phone
✅ **Auto-updating** - New data every 15 minutes

---

## 🔧 Local Development

```bash
# Install dependencies
npm install --prefix frontend

# Start dev server (hot reload)
npm run dev --prefix frontend

# Build for production
npm run build --prefix frontend

# Preview production build
npm run preview --prefix frontend
```

Dev server runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
frontend/                    # Everything for Vercel deployment
├── src/
│   ├── components/         # Graph, Stats, Filters
│   ├── hooks/             # useVisitorData (CSV parser)
│   ├── utils/             # Data filtering logic
│   └── App.tsx            # Main app
├── public/
│   └── visitors_data.csv  # Auto-synced data (auto-updated by GitHub Actions)
├── vercel.json            # Deployment config
└── package.json           # Dependencies
```

---

## 🐛 Troubleshooting

### Dashboard shows no data
- **Solution**: Wait 15 minutes for first scrape, then refresh browser
- **Check**: Go to `https://yoursite.vercel.app/visitors_data.csv` in browser

### GitHub Actions not running
- **Solution**: Go to repository Settings > Actions > General > Enable
- **Check**: Ensure `.github/workflows/fetch_data.yml` exists and has proper indentation

### Vercel build fails
- **Solution**: Check build logs in Vercel dashboard
- **Ensure**: `frontend/package.json` exists and has all dependencies
- **Try**: Delete `node_modules` and `package-lock.json`, then redeploy

### Graph looks weird
- **Solution**: Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- **Or**: Open in private/incognito window

---

## 📈 What's Next?

After deployment, you can:

1. **Share your dashboard** - Send the Vercel URL to friends
2. **Monitor occupancy** - Bookmarks it to check before going to the gym
3. **Analyze trends** - Export data using browser DevTools
4. **Add features** - Dark mode, notifications, weekly reports, etc.

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment instructions
- **Frontend README**: `frontend/README.md` - React app specific info

---

## 💡 Tips

- The dashboard works offline - data is cached in the browser
- CSV updates happen in the background, just refresh to see new data
- Use browser DevTools to inspect the `visitors_data.csv` file
- Set up branch protection rules to prevent accidental deletions

---

## 🆘 Need Help?

1. Check this Quick Start guide
2. Read the detailed documentation
3. Check GitHub Issues
4. Open a new issue with error details

---

**Happy tracking! 💪**
