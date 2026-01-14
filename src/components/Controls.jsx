import { calculateRouteDistance } from '../utils/shapes'
import { downloadGPX } from '../utils/export'

function Controls({
  targetDistance,
  onDistanceChange,
  start,
  route,
  onGenerate,
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
    const filename = `loop-route-${distance}km.gpx`
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

      {/* Target Distance */}
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

      {/* Status */}
      <div className="control-group status">
        {start ? (
          <p>Start point set</p>
        ) : (
          <p className="hint">Click map or search to set start point</p>
        )}
        {actualDistance > 0 && (
          <p className="distance">
            Actual Route: {formatDistance(actualDistance)}
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
          disabled={!start || !apiKey || isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Route'}
        </button>
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
