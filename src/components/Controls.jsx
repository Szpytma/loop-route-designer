import { calculateRouteDistance } from '../utils/shapes'
import { downloadGPX } from '../utils/export'

function Controls({
  targetDistance,
  onDistanceChange,
  routeType,
  onRouteTypeChange,
  terrain,
  onTerrainChange,
  start,
  destination,
  route,
  onGenerate,
  onShuffle,
  onClear,
  isLoading,
  error,
  apiKey,
  onApiKeyChange,
}) {
  const handleExport = () => {
    if (!route || route.length === 0) {
      alert('Please generate a route first!')
      return
    }

    const distance = Math.round(calculateRouteDistance(route) / 100) / 10
    const typeLabel = routeType === 'loop' ? 'loop' : 'out-and-back'
    const filename = `${typeLabel}-route-${distance}km.gpx`
    downloadGPX(route, filename)
  }

  const actualDistance = route.length > 0 ? calculateRouteDistance(route) : 0

  const formatDistance = (meters) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${Math.round(meters)} m`
  }

  return (
    <div className="controls">
      {/* API Key */}
      <div className="control-group api-key-section">
        <label>OpenRouteService API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your API key"
          className="text-input"
        />
        <a
          href="https://openrouteservice.org/dev/#/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="api-link"
        >
          Get free API key
        </a>
      </div>

      {/* Route Type */}
      <div className="control-group">
        <label>Route Type</label>
        <div className="route-type-buttons three-col">
          <button
            className={`route-type-btn ${routeType === 'loop' ? 'active' : ''}`}
            onClick={() => onRouteTypeChange('loop')}
          >
            Loop
          </button>
          <button
            className={`route-type-btn ${routeType === 'out-and-back' ? 'active' : ''}`}
            onClick={() => onRouteTypeChange('out-and-back')}
          >
            Out & Back
          </button>
          <button
            className={`route-type-btn ${routeType === 'point-to-point' ? 'active' : ''}`}
            onClick={() => onRouteTypeChange('point-to-point')}
          >
            A → B
          </button>
        </div>
      </div>

      {/* Terrain Preference */}
      <div className="control-group">
        <label>Terrain</label>
        <div className="route-type-buttons three-col">
          <button
            className={`route-type-btn ${terrain === 'roads' ? 'active' : ''}`}
            onClick={() => onTerrainChange('roads')}
          >
            Roads
          </button>
          <button
            className={`route-type-btn ${terrain === 'mixed' ? 'active' : ''}`}
            onClick={() => onTerrainChange('mixed')}
          >
            Mixed
          </button>
          <button
            className={`route-type-btn ${terrain === 'trails' ? 'active' : ''}`}
            onClick={() => onTerrainChange('trails')}
          >
            Trails
          </button>
        </div>
      </div>

      {/* Target Distance - hide for point-to-point */}
      {routeType !== 'point-to-point' && (
        <div className="control-group">
          <label>Target Distance: {formatDistance(targetDistance)}</label>
          <input
            type="range"
            min="1000"
            max="30000"
            step="500"
            value={targetDistance}
            onChange={(e) => onDistanceChange(parseInt(e.target.value))}
          />
          <div className="range-labels">
            <span>1 km</span>
            <span>30 km</span>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="control-group status">
        {routeType === 'point-to-point' ? (
          <>
            {start ? (
              <p className="point-set"><span className="legend-dot start"></span>Start point set</p>
            ) : (
              <p className="hint">Click map or search to set start point</p>
            )}
            {destination ? (
              <p className="point-set"><span className="legend-dot destination"></span>Destination set</p>
            ) : start ? (
              <p className="hint">Now click map or search for destination</p>
            ) : null}
          </>
        ) : (
          <>
            {start ? (
              <p className="point-set"><span className="legend-dot start"></span>Start point set</p>
            ) : (
              <p className="hint">Click map or search to set start point</p>
            )}
          </>
        )}
        {actualDistance > 0 && (
          <p className="distance">
            {routeType === 'point-to-point' ? 'Route Distance' : 'Actual Route'}: {formatDistance(actualDistance)}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="control-group error-box">
          <p>{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="control-group actions">
        <button
          className="primary"
          onClick={onGenerate}
          disabled={!start || (routeType === 'point-to-point' && !destination) || !apiKey || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Route'}
        </button>
        {routeType !== 'point-to-point' && (
          <button
            className="secondary"
            onClick={onShuffle}
            disabled={route.length === 0 || !apiKey || isLoading}
            title="Generate a new route in a different direction"
          >
            Shuffle
          </button>
        )}
        <button
          className="secondary"
          onClick={handleExport}
          disabled={route.length === 0 || isLoading}
        >
          Export GPX
        </button>
        <button className="danger" onClick={onClear} disabled={isLoading}>
          Clear
        </button>
      </div>
    </div>
  )
}

export default Controls
