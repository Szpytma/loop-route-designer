/**
 * Geocoding utilities using OpenRouteService
 */

const ORS_GEOCODE_URL = 'https://api.openrouteservice.org/geocode/search'

/**
 * Search for locations by name
 * @param {string} query - Search query (place name, address, etc.)
 * @param {string} apiKey - OpenRouteService API key
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocation(query, apiKey) {
  if (!query || query.trim().length < 2) {
    return []
  }

  if (!apiKey) {
    throw new Error('API key required for location search')
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    text: query,
    size: 5, // Limit results
  })

  const response = await fetch(`${ORS_GEOCODE_URL}?${params}`)

  if (!response.ok) {
    throw new Error('Location search failed')
  }

  const data = await response.json()

  if (!data.features) {
    return []
  }

  return data.features.map(feature => ({
    name: feature.properties.label,
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    country: feature.properties.country,
    region: feature.properties.region,
  }))
}

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out'))
            break
          default:
            reject(new Error('Failed to get location'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}
