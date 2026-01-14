/**
 * OpenRouteService routing integration
 * Converts waypoints to actual road-following routes
 */

const ORS_API_URL = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson'

/**
 * Get a route between waypoints using OpenRouteService
 * @param {Array} waypoints - Array of [lng, lat] coordinates (ORS uses lng,lat order!)
 * @param {string} apiKey - OpenRouteService API key
 * @returns {Promise<Array>} Array of [lat, lng] points forming the route
 */
export async function getRouteBetweenWaypoints(waypoints, apiKey) {
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
    return await fetchRoute(waypoints, apiKey)
  }

  // Split into overlapping chunks and combine
  const allRoutePoints = []
  for (let i = 0; i < waypoints.length - 1; i += maxWaypointsPerRequest - 1) {
    const chunk = waypoints.slice(i, i + maxWaypointsPerRequest)
    if (chunk.length < 2) break

    const chunkRoute = await fetchRoute(chunk, apiKey)

    // Avoid duplicating the connection point
    if (allRoutePoints.length > 0) {
      chunkRoute.shift()
    }
    allRoutePoints.push(...chunkRoute)
  }

  return allRoutePoints
}

/**
 * Fetch route from OpenRouteService API
 * @param {Array} waypoints - Array of [lng, lat] coordinates
 * @param {string} apiKey - API key
 * @returns {Promise<Array>} Route points as [lat, lng]
 */
async function fetchRoute(waypoints, apiKey) {
  const response = await fetch(ORS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify({
      coordinates: waypoints,
      instructions: false,
      preference: 'shortest', // or 'recommended' for scenic routes
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

  // Convert from [lng, lat] to [lat, lng] for Leaflet
  const coordinates = data.features[0].geometry.coordinates
  return coordinates.map(([lng, lat]) => [lat, lng])
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
