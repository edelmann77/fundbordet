import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWVuNzciLCJhIjoiY21taHF0dWU4MHFnNzJwczZwajg0eGNxcCJ9.jbHXwO95T8UKk1vBHgccyw";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar placeholder */}
      <header className="h-14 bg-ink flex items-center px-6">
        <span className="text-ink-faint text-sm italic">
          Top bar — coming soon
        </span>
      </header>

      <main className="flex-1 flex items-center">
        {/* Content placeholder */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-ink-muted">You are now logged in</p>
        </div>

        {/* Map */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-ink text-center">
              Fundspredning
            </h2>
            <div className="w-full" style={{ height: "60vh" }}>
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: 11.5,
                  latitude: 56.2,
                  zoom: 6,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/outdoors-v12"
                interactive={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
