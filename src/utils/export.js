/**
 * GPX export utilities
 * Generates GPX files compatible with Strava, Garmin, etc.
 */

/**
 * Generate GPX XML string from route points
 * @param {Array} route - Array of [lat, lng] points
 * @param {string} name - Name of the route
 * @returns {string} GPX XML string
 */
export function generateGPX(route, name = 'Pizza Route') {
  const timestamp = new Date().toISOString()

  const trackPoints = route.map(([lat, lng]) =>
    `      <trkpt lat="${lat}" lon="${lng}">
        <ele>0</ele>
      </trkpt>`
  ).join('\n')

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Pizza Route Designer"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(name)}</name>
    <time>${timestamp}</time>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`

  return gpx
}

/**
 * Escape special XML characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Download GPX file
 * @param {Array} route - Array of [lat, lng] points
 * @param {string} filename - Name for the downloaded file
 */
export function downloadGPX(route, filename = 'pizza-route.gpx') {
  const gpxContent = generateGPX(route, filename.replace('.gpx', ''))
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
