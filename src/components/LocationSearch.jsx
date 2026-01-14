import { useState, useRef, useEffect } from 'react'
import { searchLocation } from '../utils/geocoding'

function LocationSearch({ apiKey, onLocationSelect, onLocateMe, isLocating }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeout = useRef(null)
  const containerRef = useRef(null)

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2 || !apiKey) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const locations = await searchLocation(searchQuery, apiKey)
      setResults(locations)
      setShowResults(true)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Debounce search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch(value)
    }, 300)
  }

  const handleResultClick = (location) => {
    setQuery(location.name)
    setShowResults(false)
    setResults([])
    onLocationSelect(location)
  }

  return (
    <div className="location-search" ref={containerRef}>
      <div className="search-row">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search location..."
            className="text-input search-input"
            disabled={!apiKey}
          />
          {isSearching && <div className="search-spinner"></div>}
        </div>
        <button
          className="locate-btn"
          onClick={onLocateMe}
          disabled={isLocating}
          title="Use my location"
        >
          {isLocating ? '...' : '📍'}
        </button>
      </div>

      {!apiKey && (
        <p className="search-hint">Enter API key below to enable search</p>
      )}

      {showResults && results.length > 0 && (
        <ul className="search-results">
          {results.map((location, index) => (
            <li
              key={index}
              onClick={() => handleResultClick(location)}
              className="search-result-item"
            >
              <span className="result-name">{location.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LocationSearch
