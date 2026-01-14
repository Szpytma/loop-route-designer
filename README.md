# Loop Route Designer

A simple web app for creating running routes that start and end at the same point. Set your desired distance, pick a starting location, and get a loop route that follows real roads.

**Live Demo:** https://szpytma.github.io/loop-route-designer/

## Features

- **Loop Routes** - Routes always return to your starting point
- **Distance-Based** - Choose your target distance (1-30 km)
- **Real Roads** - Routes follow actual walkable/runnable paths
- **Location Search** - Find any location by name
- **GPS Support** - Use your current location as the starting point
- **GPX Export** - Download routes for Strava, Garmin, and other apps

## How It Works

1. **Set your starting point** - Click on the map, search for a location, or use your current GPS position
2. **Choose your distance** - Use the slider to select your target route length
3. **Generate** - The app creates waypoints in a loop around your start point and calculates a route along real roads
4. **Export** - Download the GPX file and import it into your favorite running app

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
