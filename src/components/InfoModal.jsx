function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2>How to Use</h2>

        <section className="modal-section">
          <h3>1. Set Your Starting Point</h3>
          <ul>
            <li><strong>Click on the map</strong> to place your start/finish point</li>
            <li><strong>Search</strong> for a location by name</li>
            <li><strong>Use GPS</strong> button to use your current location</li>
          </ul>
        </section>

        <section className="modal-section">
          <h3>2. Choose Route Type</h3>
          <ul>
            <li><strong>Loop</strong> - Circular route back to start via different roads</li>
            <li><strong>Out & Back</strong> - Go out and return the same way</li>
            <li><strong>A → B</strong> - Point-to-point route to a destination</li>
          </ul>
        </section>

        <section className="modal-section">
          <h3>3. Choose Terrain</h3>
          <ul>
            <li><strong>Roads</strong> - Shortest route on paved roads and sidewalks</li>
            <li><strong>Mixed</strong> - Balanced mix of roads and paths (default)</li>
            <li><strong>Trails</strong> - Prefers parks, paths, and hiking trails</li>
          </ul>
        </section>

        <section className="modal-section">
          <h3>4. Choose Distance</h3>
          <p>Use the slider to set your target route distance (1-30 km).</p>
        </section>

        <section className="modal-section">
          <h3>5. Generate Route</h3>
          <ul>
            <li>Click <strong>Generate Route</strong> to create your route</li>
            <li>Click <strong>Shuffle</strong> to get a different route direction</li>
            <li><strong>Drag orange waypoints</strong> to reshape the route</li>
            <li>View the <strong>elevation profile</strong> below the controls</li>
          </ul>
        </section>

        <section className="modal-section">
          <h3>6. Export Your Route</h3>
          <p>Click <strong>Export GPX</strong> to download your route file.</p>
        </section>

        <h2>Import to Fitness Apps</h2>

        <section className="modal-section">
          <h3>Strava</h3>
          <ol>
            <li>Go to <a href="https://www.strava.com/routes/new" target="_blank" rel="noopener noreferrer">strava.com/routes/new</a></li>
            <li>Click the upload icon or drag & drop the GPX file</li>
            <li>Save the route and sync to your device</li>
          </ol>
        </section>

        <section className="modal-section">
          <h3>Garmin Connect</h3>
          <ol>
            <li>Go to <a href="https://connect.garmin.com/modern/courses" target="_blank" rel="noopener noreferrer">connect.garmin.com</a> → Courses</li>
            <li>Click Import → Select your GPX file</li>
            <li>Sync to your Garmin device</li>
          </ol>
        </section>

        <section className="modal-section">
          <h3>Komoot</h3>
          <ol>
            <li>Open <a href="https://www.komoot.com/plan" target="_blank" rel="noopener noreferrer">komoot.com/plan</a></li>
            <li>Click Import GPX in the route planner</li>
            <li>Save and sync to your device</li>
          </ol>
        </section>

        <section className="modal-section">
          <h3>Wahoo / ELEMNT</h3>
          <ol>
            <li>Email the GPX file to yourself</li>
            <li>Open on your phone and share to Wahoo app</li>
            <li>Or upload via wahooligan.com</li>
          </ol>
        </section>

        <section className="modal-section">
          <h3>Coros</h3>
          <ol>
            <li>Open Coros app → Profile → Routes</li>
            <li>Tap + and import GPX file</li>
            <li>Sync to your watch</li>
          </ol>
        </section>

        <section className="modal-section">
          <h3>Apple Watch (WorkOutDoors)</h3>
          <ol>
            <li>Install WorkOutDoors app</li>
            <li>Open GPX file on iPhone → Share to WorkOutDoors</li>
            <li>Route syncs to your Apple Watch</li>
          </ol>
        </section>

        <section className="modal-section hint">
          <p>GPX is a universal format supported by most fitness apps and GPS devices.</p>
        </section>

        <h2>Support</h2>
        <section className="modal-section">
          <p>If you find TrailMaker useful, consider supporting its development!</p>
          <a
            href="https://buymeacoffee.com/szpytma"
            target="_blank"
            rel="noopener noreferrer"
            className="coffee-link"
          >
            ☕ Buy me a coffee
          </a>
        </section>
      </div>
    </div>
  )
}

export default InfoModal
