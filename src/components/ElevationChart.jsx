function ElevationChart({ elevation }) {
  if (!elevation || elevation.length === 0) {
    return null
  }

  // Calculate stats
  const elevations = elevation.map(p => p.elevation)
  const minElevation = Math.min(...elevations)
  const maxElevation = Math.max(...elevations)
  const elevationRange = maxElevation - minElevation || 1
  const totalDistance = elevation[elevation.length - 1]?.distance || 0

  // Calculate elevation gain (sum of positive changes)
  let elevationGain = 0
  let elevationLoss = 0
  for (let i = 1; i < elevation.length; i++) {
    const diff = elevation[i].elevation - elevation[i - 1].elevation
    if (diff > 0) elevationGain += diff
    else elevationLoss += Math.abs(diff)
  }

  // Sample points for smoother rendering (max 100 points)
  const sampleRate = Math.max(1, Math.floor(elevation.length / 100))
  const sampledData = elevation.filter((_, i) => i % sampleRate === 0)

  // Create SVG path
  const width = 100
  const height = 40
  const padding = 2

  const points = sampledData.map((point, i) => {
    const x = (point.distance / totalDistance) * (width - padding * 2) + padding
    const y = height - padding - ((point.elevation - minElevation) / elevationRange) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  // Create area path (filled)
  const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`

  const formatElevation = (m) => `${Math.round(m)}m`
  const formatDistance = (m) => m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${Math.round(m)}m`

  return (
    <div className="elevation-chart">
      <div className="elevation-header">
        <span className="elevation-title">Elevation Profile</span>
        <div className="elevation-stats">
          <span className="stat gain">+{formatElevation(elevationGain)}</span>
          <span className="stat loss">-{formatElevation(elevationLoss)}</span>
        </div>
      </div>
      <div className="elevation-graph">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#elevationGradient)" />
          <polyline
            points={points}
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="elevation-labels">
          <span>{formatElevation(maxElevation)}</span>
          <span>{formatElevation(minElevation)}</span>
        </div>
      </div>
      <div className="elevation-distance">
        <span>0</span>
        <span>{formatDistance(totalDistance)}</span>
      </div>
    </div>
  )
}

export default ElevationChart
