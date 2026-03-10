import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Tabs } from "fundbrdet-ui";
import RegisterFindingForm from "../components/RegisterFindingForm";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWVuNzciLCJhIjoiY21taHF0dWU4MHFnNzJwczZwajg0eGNxcCJ9.jbHXwO95T8UKk1vBHgccyw";

const cardClass =
  "w-full max-w-sm text-left rounded-xl border border-edge bg-surface hover:bg-black/5 transition-colors px-6 py-4";

export default function HomePage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="h-14 bg-ink flex items-center px-6 shrink-0">
        <span className="text-xl">🪙</span>
      </header>

      <main className="flex-1 flex items-center">
        {/* Navigation cards */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <Link
            to="/detector/my-findings"
            className={`${cardClass} no-underline`}
          >
            <p className="font-semibold text-ink text-base">Mine fund</p>
            <p className="text-sm text-ink-muted mt-0.5">
              Se og administrer dine registrerede fund
            </p>
          </Link>

          <button onClick={() => setCreateOpen(true)} className={cardClass}>
            <p className="font-semibold text-ink text-base">Opret fund</p>
            <p className="text-sm text-ink-muted mt-0.5">
              Registrer et nyt fund
            </p>
          </button>
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

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="full"
        className="h-157"
        hideCloseButton
      >
        <Tabs
          defaultValue="register"
          variant="line"
          size="md"
          tabs={[
            {
              value: "register",
              label: "Opret fund",
              children: (
                <RegisterFindingForm
                  key={String(createOpen)}
                  onCancel={() => setCreateOpen(false)}
                />
              ),
            },
            { value: "import", label: "Importer fund", children: null },
          ]}
        />
      </Modal>
    </div>
  );
}
