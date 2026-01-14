import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Start marker icon
const startIcon = new L.DivIcon({
  className: 'start-marker',
  html: '<div class="start-icon"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
  })
  return null
}

function MapPanner({ mapCenter }) {
  const map = useMap()

  useEffect(() => {
    if (mapCenter) {
      map.setView([mapCenter.lat, mapCenter.lng], 14)
    }
  }, [mapCenter, map])

  return null
}

function FitBounds({ route, waypoints }) {
  const map = useMap()

  useEffect(() => {
    const points = route.length > 0 ? route : waypoints
    if (points && points.length > 1) {
      const bounds = L.latLngBounds(points.map(p => Array.isArray(p) ? p : [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [route, waypoints, map])

  return null
}

function Map({ center, mapCenter, waypoints, route, onMapClick, isLoading }) {
  const defaultCenter = [51.5074, -0.1278]
  const defaultZoom = 13

  return (
    <div className="map-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Finding route on roads...</p>
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MapPanner mapCenter={mapCenter} />
        <FitBounds route={route} waypoints={waypoints} />

        {/* Start marker */}
        {center && (
          <Marker position={[center.lat, center.lng]} icon={startIcon} />
        )}

        {/* Waypoints (target shape) */}
        {waypoints && waypoints.length > 0 && (
          <>
            <Polyline
              positions={waypoints}
              pathOptions={{
                color: '#888',
                weight: 2,
                opacity: 0.4,
                dashArray: '8, 8',
              }}
            />
            {waypoints.map((point, index) => (
              <CircleMarker
                key={index}
                center={point}
                radius={3}
                pathOptions={{
                  color: '#888',
                  fillColor: '#888',
                  fillOpacity: 0.6,
                }}
              />
            ))}
          </>
        )}

        {/* Actual route */}
        {route && route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#2563eb',
              weight: 4,
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default Map
