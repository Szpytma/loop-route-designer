/**
 * OpenRouteService routing integration
 * Converts waypoints to actual road-following routes
 */

const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions'

/**
 * Get a route between waypoints using OpenRouteService
 * @param {Array} waypoints - Array of [lng, lat] coordinates (ORS uses lng,lat order!)
 * @param {string} apiKey - OpenRouteService API key
 * @param {string} terrain - Terrain preference: 'roads' or 'trails'
 * @returns {Promise<Object>} Object with route points and elevation data
 */
export async function getRouteBetweenWaypoints(waypoints, apiKey, terrain = 'roads') {
  if (!apiKey) {
    throw new Error('OpenRouteService API key is required')
  }

  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints are required')
  }

  // ORS has a limit of 50 coordinates per request
  // If we have more, we need to split into chunks
  const maxWaypointsPerRequest = 50

  if (waypoints.length <= maxWaypointsPerRequest) {
    return await fetchRoute(waypoints, apiKey, terrain)
  }

  // Split into overlapping chunks and combine
  const allRoutePoints = []
  const allElevationData = []
  let totalDistance = 0

  for (let i = 0; i < waypoints.length - 1; i += maxWaypointsPerRequest - 1) {
    const chunk = waypoints.slice(i, i + maxWaypointsPerRequest)
    if (chunk.length < 2) break

    const result = await fetchRoute(chunk, apiKey, terrain)

    // Avoid duplicating the connection point
    if (allRoutePoints.length > 0) {
      result.route.shift()
      result.elevation.shift()
    }
    allRoutePoints.push(...result.route)
    allElevationData.push(...result.elevation)
    totalDistance += result.distance
  }

  return {
    route: allRoutePoints,
    elevation: allElevationData,
    distance: totalDistance
  }
}

/**
 * Fetch route from OpenRouteService API
 * @param {Array} waypoints - Array of [lng, lat] coordinates
 * @param {string} apiKey - API key
 * @param {string} terrain - Terrain preference: 'roads' or 'trails'
 * @returns {Promise<Object>} Object with route, elevation, and distance
 */
async function fetchRoute(waypoints, apiKey, terrain) {
  // foot-hiking for trails, foot-walking for roads/mixed
  const profile = terrain === 'trails' ? 'foot-hiking' : 'foot-walking'
  const apiUrl = `${ORS_BASE_URL}/${profile}/geojson`

  // Preference: shortest for roads, recommended for trails/mixed
  const preference = terrain === 'roads' ? 'shortest' : 'recommended'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({
      coordinates: waypoints,
      instructions: false,
      elevation: true,
      preference: preference,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `Routing failed: ${response.status}`)
  }

  const data = await response.json()

  if (!data.features || !data.features[0]?.geometry?.coordinates) {
    throw new Error('Invalid response from routing service')
  }

  const coordinates = data.features[0].geometry.coordinates
  const distance = data.features[0].properties?.summary?.distance || 0

  // Extract route points and elevation data
  // Coordinates are [lng, lat, elevation] when elevation is requested
  const route = []
  const elevation = []
  let cumulativeDistance = 0

  for (let i = 0; i < coordinates.length; i++) {
    const [lng, lat, elev] = coordinates[i]
    route.push([lat, lng])

    // Calculate cumulative distance for elevation chart x-axis
    if (i > 0) {
      const [prevLng, prevLat] = coordinates[i - 1]
      cumulativeDistance += calculateDistance(prevLat, prevLng, lat, lng)
    }

    elevation.push({
      distance: cumulativeDistance,
      elevation: elev || 0
    })
  }

  return { route, elevation, distance }
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Calculate route distance from ORS response
 * @param {Object} data - ORS API response
 * @returns {number} Distance in meters
 */
export function getRouteDistance(data) {
  if (data.features?.[0]?.properties?.summary?.distance) {
    return data.features[0].properties.summary.distance
  }
  return 0
}
