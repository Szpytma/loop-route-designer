import { useState, useEffect } from 'react'
import Map from './components/Map'
import Controls from './components/Controls'
import LocationSearch from './components/LocationSearch'
import InfoModal from './components/InfoModal'
import ElevationChart from './components/ElevationChart'
import {
  generateLoopWaypoints,
  generateOutAndBackWaypoints,
  generatePointToPointWaypoints,
  waypointsToORSFormat,
  waypointsToLeafletFormat,
} from './utils/shapes'
import { getRouteBetweenWaypoints } from './utils/routing'
import { getCurrentLocation } from './utils/geocoding'

function App() {
  const [start, setStart] = useState(null)
  const [destination, setDestination] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [waypoints, setWaypoints] = useState([])
  const [route, setRoute] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState(null)
  const [targetDistance, setTargetDistance] = useState(5000) // 5km default
  const [routeType, setRouteType] = useState('loop') // 'loop', 'out-and-back', or 'point-to-point'
  const [terrain, setTerrain] = useState('mixed') // 'roads', 'mixed', or 'trails'
  const [elevation, setElevation] = useState([])
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ors_api_key') || ''
  })
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('ors_api_key', apiKey)
    }
  }, [apiKey])

  const handleMapClick = (latlng) => {
    // In point-to-point mode, first click sets start, second sets destination
    if (routeType === 'point-to-point' && start && !destination) {
      setDestination(latlng)
    } else {
      setStart(latlng)
      setDestination(null)
    }
    setWaypoints([])
    setRoute([])
    setElevation([])
    setError(null)
  }

  const handleLocateMe = async () => {
    setIsLocating(true)
    setError(null)
    try {
      const location = await getCurrentLocation()
      setMapCenter(location)
      setStart(location)
      setDestination(null)
      setWaypoints([])
      setRoute([])
      setElevation([])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLocating(false)
    }
  }

  const handleLocationSelect = (location) => {
    const point = { lat: location.lat, lng: location.lng }
    setMapCenter(point)
    // In point-to-point mode with start already set, this sets destination
    if (routeType === 'point-to-point' && start) {
      setDestination(point)
    } else {
      setStart(point)
      setDestination(null)
    }
    setWaypoints([])
    setRoute([])
    setElevation([])
    setError(null)
  }

  const handleGenerate = async () => {
    if (!start) {
      setError('Please set a starting point first!')
      return
    }

    if (routeType === 'point-to-point' && !destination) {
      setError('Please set a destination point!')
      return
    }

    if (!apiKey) {
      setError('Please enter your OpenRouteService API key')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Generate waypoints based on route type
      let newWaypoints
      if (routeType === 'loop') {
        newWaypoints = generateLoopWaypoints(start, targetDistance)
      } else if (routeType === 'out-and-back') {
        newWaypoints = generateOutAndBackWaypoints(start, targetDistance)
      } else {
        newWaypoints = generatePointToPointWaypoints(start, destination)
      }
      setWaypoints(newWaypoints)

      // Get actual road-following route with elevation
      const orsWaypoints = waypointsToORSFormat(newWaypoints)
      const result = await getRouteBetweenWaypoints(orsWaypoints, apiKey, terrain)

      setRoute(result.route)
      setElevation(result.elevation)
    } catch (err) {
      console.error('Routing error:', err)
      setError(err.message || 'Failed to generate route. Try a different location or distance.')
      setRoute([])
      setElevation([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setStart(null)
    setDestination(null)
    setWaypoints([])
    setRoute([])
    setElevation([])
    setError(null)
  }

  const handleRouteTypeChange = (newType) => {
    setRouteType(newType)
    // Clear destination when switching away from point-to-point
    if (newType !== 'point-to-point') {
      setDestination(null)
    }
    // Clear existing route when changing type
    setWaypoints([])
    setRoute([])
    setElevation([])
    setError(null)
  }

  const handleWaypointDrag = async (index, newPosition) => {
    // Update waypoints array
    const newWaypoints = [...waypoints]
    newWaypoints[index] = newPosition

    // If first waypoint is moved, also update the last one (they should match to close the loop)
    if (index === 0) {
      newWaypoints[newWaypoints.length - 1] = newPosition
    }

    setWaypoints(newWaypoints)

    // Recalculate route with new waypoints
    setIsLoading(true)
    setError(null)

    try {
      const orsWaypoints = waypointsToORSFormat(newWaypoints)
      const result = await getRouteBetweenWaypoints(orsWaypoints, apiKey, terrain)
      setRoute(result.route)
      setElevation(result.elevation)
    } catch (err) {
      console.error('Routing error:', err)
      setError(err.message || 'Failed to recalculate route.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <h1>TrailMaker</h1>
          <p>Design your perfect running or walking route</p>
        </div>
        <div className="header-buttons">
          <a
            href="https://buymeacoffee.com/szpytma"
            target="_blank"
            rel="noopener noreferrer"
            className="coffee-btn"
            title="Buy me a coffee"
          >
            ☕
          </a>
          <button className="help-btn" onClick={() => setShowInfo(true)} title="How to use">
            ?
          </button>
        </div>
      </div>
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <div className="main-container">
        <div className="sidebar">
          <LocationSearch
            apiKey={apiKey}
            onLocationSelect={handleLocationSelect}
            onLocateMe={handleLocateMe}
            isLocating={isLocating}
          />
          <Controls
            targetDistance={targetDistance}
            onDistanceChange={setTargetDistance}
            routeType={routeType}
            onRouteTypeChange={handleRouteTypeChange}
            terrain={terrain}
            onTerrainChange={setTerrain}
            start={start}
            destination={destination}
            route={route}
            onGenerate={handleGenerate}
            onShuffle={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
            error={error}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
          />
          <ElevationChart elevation={elevation} />
        </div>
        <Map
          center={start}
          destination={destination}
          mapCenter={mapCenter}
          waypoints={waypointsToLeafletFormat(waypoints)}
          route={route}
          routeType={routeType}
          onMapClick={handleMapClick}
          onWaypointDrag={handleWaypointDrag}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default App
