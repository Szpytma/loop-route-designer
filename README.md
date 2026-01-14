# TrailMaker

A simple web app for designing running and walking routes. Create loop routes, out-and-back routes, or point-to-point trails to your favorite destinations. Pick a starting location, choose your terrain preference, and get a route that follows real roads and paths.

**Live Demo:** https://szpytma.github.io/loop-route-designer/

## Features

- **Loop Routes** - Circular routes that return to your starting point
- **Out & Back Routes** - Go out and return the same way
- **Point-to-Point** - Route from A to B (great for finding trails to destinations)
- **Terrain Preference** - Choose roads, mixed, or trails
- **Elevation Profile** - See elevation gain/loss with visual chart
- **Distance-Based** - Choose your target distance (1-30 km)
- **Real Roads** - Routes follow actual walkable/runnable paths
- **Random Directions** - Each route generates in a different direction
- **Shuffle Button** - Don't like the route? Shuffle to get a new one
- **Draggable Waypoints** - Fine-tune your route by dragging waypoints
- **Location Search** - Find any location by name
- **GPS Support** - Use your current location as the starting point
- **GPX Export** - Download routes for Strava, Garmin, and other apps
- **Built-in Help** - Usage guide and export instructions for popular apps

## How It Works

1. **Set your starting point** - Click on the map, search for a location, or use your current GPS position
2. **Choose route type** - Select **Loop**, **Out & Back**, or **A → B** (point-to-point)
3. **For A → B mode** - Click or search to set your destination (green marker)
4. **Choose terrain** - Select **Roads**, **Mixed**, or **Trails**
5. **Choose your distance** - Use the slider (Loop/Out & Back only)
6. **Generate** - The app calculates a route along real roads/trails
7. **Review elevation** - Check the elevation profile to see hills and total gain/loss
8. **Customize** - Click **Shuffle** for a different direction, or drag waypoints to reshape
9. **Export** - Download the GPX file and import it into your favorite running app

Click the **?** button in the app for detailed export instructions for Strava, Garmin, Komoot, and more.

## API Key Required

This app uses [OpenRouteService](https://openrouteservice.org/) to calculate routes along real roads. You'll need a free API key to use it.

### Why is an API key needed?

The app needs to find actual roads and paths between waypoints. OpenRouteService provides this routing data for free, but requires an API key to prevent abuse and manage usage limits.

### How to get your free API key

1. Go to [openrouteservice.org/dev/#/signup](https://openrouteservice.org/dev/#/signup)
2. Create a free account
3. After signing in, go to your dashboard
4. Copy your API key
5. Paste it into the app

The free tier includes **2,000 requests per day**, which is plenty for personal use.

### Is my API key safe?

Your API key is stored only in your browser's local storage. It is never sent to any server other than OpenRouteService for routing requests.

## Running Locally

```bash
# Clone the repository
git clone https://github.com/Szpytma/loop-route-designer.git
cd loop-route-designer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Leaflet** - Interactive maps
- **OpenStreetMap** - Map tiles
- **OpenRouteService** - Routing API

## License

MIT
