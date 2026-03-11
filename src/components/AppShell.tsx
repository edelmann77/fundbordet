import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWVuNzciLCJhIjoiY21taHF0dWU4MHFnNzJwczZwajg0eGNxcCJ9.jbHXwO95T8UKk1vBHgccyw";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  const navItems = [
    { to: "/detector/my-findings", label: t("appShell.nav.myFindings") },
    { to: "/detector/create-finding", label: t("appShell.nav.createFinding") },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 bg-ink flex items-center px-6 gap-8 shrink-0">
        <span className="text-xl">🪙</span>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors no-underline",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 flex items-center">
        {/* Page content */}
        <div className="flex-1 h-full flex items-center justify-center p-8">
          {children}
        </div>

        {/* Map */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-ink text-center">
              {t("appShell.mapTitle")}
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
