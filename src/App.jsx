import { useState, useEffect } from 'react'
import Map from './components/Map'
import Controls from './components/Controls'
import LocationSearch from './components/LocationSearch'
import InfoModal from './components/InfoModal'
import {
  generateLoopWaypoints,
  waypointsToORSFormat,
  waypointsToLeafletFormat,
} from './utils/shapes'
import { getRouteBetweenWaypoints } from './utils/routing'
import { getCurrentLocation } from './utils/geocoding'

function App() {
  const [start, setStart] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [waypoints, setWaypoints] = useState([])
  const [route, setRoute] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState(null)
  const [targetDistance, setTargetDistance] = useState(5000) // 5km default
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
    setStart(latlng)
    setWaypoints([])
    setRoute([])
    setError(null)
  }

  const handleLocateMe = async () => {
    setIsLocating(true)
    setError(null)
    try {
      const location = await getCurrentLocation()
      setMapCenter(location)
      setStart(location)
      setWaypoints([])
      setRoute([])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLocating(false)
    }
  }

  const handleLocationSelect = (location) => {
    const point = { lat: location.lat, lng: location.lng }
    setMapCenter(point)
    setStart(point)
    setWaypoints([])
    setRoute([])
    setError(null)
  }

  const handleGenerate = async () => {
    if (!start) {
      setError('Please set a starting point first!')
      return
    }

    if (!apiKey) {
      setError('Please enter your OpenRouteService API key')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Generate loop waypoints
      const newWaypoints = generateLoopWaypoints(start, targetDistance)
      setWaypoints(newWaypoints)

      // Get actual road-following route
      const orsWaypoints = waypointsToORSFormat(newWaypoints)
      const actualRoute = await getRouteBetweenWaypoints(orsWaypoints, apiKey)

      setRoute(actualRoute)
    } catch (err) {
      console.error('Routing error:', err)
      setError(err.message || 'Failed to generate route. Try a different location or distance.')
      setRoute([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setStart(null)
    setWaypoints([])
    setRoute([])
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
      const actualRoute = await getRouteBetweenWaypoints(orsWaypoints, apiKey)
      setRoute(actualRoute)
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
          <h1>Loop Route Designer</h1>
          <p>Create running routes that start and end at the same point</p>
        </div>
        <button className="help-btn" onClick={() => setShowInfo(true)} title="How to use">
          ?
        </button>
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
            start={start}
            route={route}
            onGenerate={handleGenerate}
            onShuffle={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
            error={error}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
          />
        </div>
        <Map
          center={start}
          mapCenter={mapCenter}
          waypoints={waypointsToLeafletFormat(waypoints)}
          route={route}
          onMapClick={handleMapClick}
          onWaypointDrag={handleWaypointDrag}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default App
