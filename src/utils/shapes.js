/**
 * Loop Route Generator
 * Creates running routes that start and end at the same point
 */

const EARTH_RADIUS = 6371000

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function destinationPoint(center, distance, bearing) {
  const lat1 = toRadians(center.lat)
  const lng1 = toRadians(center.lng)
  const angularDistance = distance / EARTH_RADIUS

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
    Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
  )

  const lng2 = lng1 + Math.atan2(
    Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
    Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
  )

  return {
    lat: lat2 * (180 / Math.PI),
    lng: lng2 * (180 / Math.PI)
  }
}

/**
 * Generate waypoints for a loop route
 *
 * The start point is ON the loop (not at center), so the route
 * goes around the loop and returns to start without extra distance.
 *
 * @param {Object} start - {lat, lng} starting point
 * @param {number} targetDistance - desired route distance in meters
 * @returns {Array} Array of {lat, lng} waypoints
 */
export function generateLoopWaypoints(start, targetDistance) {
  // Roads are typically 30-50% longer than straight lines
  const roadFactor = 1.4

  // For a circle: circumference = 2 * PI * radius
  // We want circumference * roadFactor = targetDistance
  // So radius = targetDistance / (2 * PI * roadFactor)
  const radius = targetDistance / (2 * Math.PI * roadFactor)

  // Random bearing (0 to 2*PI) so routes go in different directions each time
  const randomBearing = Math.random() * 2 * Math.PI
  const loopCenter = destinationPoint(start, radius, randomBearing)

  // Number of waypoints around the loop
  const waypointCount = 8

  const waypoints = []

  // Generate waypoints in a circle, starting from opposite the center direction
  // This ensures the start point is on the edge of the loop
  const startAngle = randomBearing + Math.PI
  for (let i = 0; i < waypointCount; i++) {
    const angle = startAngle + (2 * Math.PI * i) / waypointCount
    const point = destinationPoint(loopCenter, radius, angle)
    waypoints.push(point)
  }

  // Close the loop - first point again
  waypoints.push(waypoints[0])

  return waypoints
}

/**
 * Convert waypoints to OpenRouteService format [lng, lat]
 */
export function waypointsToORSFormat(waypoints) {
  return waypoints.map(wp => [wp.lng, wp.lat])
}

/**
 * Convert waypoints to Leaflet format [lat, lng]
 */
export function waypointsToLeafletFormat(waypoints) {
  return waypoints.map(wp => [wp.lat, wp.lng])
}

/**
 * Calculate the total distance of a route in meters
 */
export function calculateRouteDistance(route) {
  if (route.length < 2) return 0

  let totalDistance = 0
  for (let i = 1; i < route.length; i++) {
    const [lat1, lng1] = route[i - 1]
    const [lat2, lng2] = route[i]

    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    totalDistance += EARTH_RADIUS * c
  }

  return totalDistance
}
