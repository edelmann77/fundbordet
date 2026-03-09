import { Link } from "react-router-dom";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWVuNzciLCJhIjoiY21taHF0dWU4MHFnNzJwczZwajg0eGNxcCJ9.jbHXwO95T8UKk1vBHgccyw";

const navCards = [
  { to: "/detector/my-findings", label: "Mine fund", description: "Se og administrer dine registrerede fund" },
  { to: "/detector/create-finding", label: "Opret fund", description: "Registrer et nyt fund" },
  { to: "/detector/import-findings", label: "Importer fund", description: "Importer fund fra en fil" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-ink flex items-center px-6 shrink-0">
        <span className="text-xl">🪙</span>
      </header>

      <main className="flex-1 flex items-center">
        {/* Navigation cards */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          {navCards.map(({ to, label, description }) => (
            <Link
              key={to}
              to={to}
              className="w-full max-w-sm no-underline rounded-xl border border-edge bg-surface hover:bg-black/5 transition-colors px-6 py-4"
            >
              <p className="font-semibold text-ink text-base">{label}</p>
              <p className="text-sm text-ink-muted mt-0.5">{description}</p>
            </Link>
          ))}
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
