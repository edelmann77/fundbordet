import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Selector } from "./Selector";

const trailOptions = [
  { value: "pct", label: "Pacific Crest Trail" },
  { value: "at", label: "Appalachian Trail" },
  { value: "cdt", label: "Continental Divide Trail" },
  { value: "jmt", label: "John Muir Trail" },
  { value: "wonderland", label: "Wonderland Trail" },
  { value: "ozark", label: "Ozark Highlands Trail", disabled: true },
];

const terrainOptions = [
  { value: "alpine", label: "Alpine" },
  { value: "forest", label: "Forest" },
  { value: "desert", label: "Desert" },
  { value: "coastal", label: "Coastal" },
  { value: "canyon", label: "Canyon" },
  { value: "wetlands", label: "Wetlands", disabled: true },
];

const meta: Meta<typeof Selector> = {
  title: "Components/Selector",
  component: Selector,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A fully accessible selector supporting both single and multi-select modes. Keyboard navigable with ARIA roles, tags for multi selections, and full outdoor theming.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "380px", paddingBottom: "16rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Selector>;

// ─── Single select ────────────────────────────────────────────────────────────

export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Selector
        label="Favourite Trail"
        placeholder="Choose a trail…"
        options={trailOptions}
        value={value}
        onChange={setValue}
        helperText="Select the trail you'd most like to hike."
      />
    );
  },
};

export const SingleWithValue: Story = {
  render: () => {
    const [value, setValue] = useState<string>("jmt");
    return (
      <Selector
        label="Favourite Trail"
        options={trailOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

// ─── Multi select ─────────────────────────────────────────────────────────────

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Selector
        multiple
        label="Preferred Terrain"
        placeholder="Choose terrain types…"
        options={terrainOptions}
        value={value}
        onChange={setValue}
        helperText="Select all terrain types you enjoy."
      />
    );
  },
};

export const MultiWithValues: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([
      "alpine",
      "forest",
      "coastal",
    ]);
    return (
      <Selector
        multiple
        label="Preferred Terrain"
        options={terrainOptions}
        value={value}
        onChange={setValue}
      />
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState<string | undefined>();
    const [md, setMd] = useState<string | undefined>();
    const [lg, setLg] = useState<string | undefined>();
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          paddingBottom: "14rem",
        }}
      >
        <Selector
          size="sm"
          label="Small"
          placeholder="Small selector"
          options={trailOptions}
          value={sm}
          onChange={setSm}
        />
        <Selector
          size="md"
          label="Medium"
          placeholder="Medium selector"
          options={trailOptions}
          value={md}
          onChange={setMd}
        />
        <Selector
          size="lg"
          label="Large"
          placeholder="Large selector"
          options={trailOptions}
          value={lg}
          onChange={setLg}
        />
      </div>
    );
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>();
    return (
      <Selector
        label="Emergency Route"
        placeholder="Select a route…"
        options={trailOptions}
        value={value}
        onChange={setValue}
        error="You must select an emergency exit route before proceeding."
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Selector
      label="Permit Zone (locked)"
      options={trailOptions}
      value="pct"
      disabled
      helperText="Permit zone cannot be changed after booking."
    />
  ),
};

export const EmptyOptions: Story = {
  render: () => (
    <Selector
      label="Available Campsites"
      options={[]}
      placeholder="No campsites available"
      helperText="All campsites are fully booked for this date."
    />
  ),
};

// ─── Combined form ────────────────────────────────────────────────────────────

export const TrailPlannerForm: Story = {
  render: () => {
    const [trail, setTrail] = useState<string | undefined>();
    const [terrain, setTerrain] = useState<string[]>([]);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          maxWidth: "400px",
          paddingBottom: "16rem",
        }}
      >
        <Selector
          label="Primary Trail"
          placeholder="Choose a trail…"
          options={trailOptions}
          value={trail}
          onChange={setTrail}
          helperText="The main trail for your expedition."
        />
        <Selector
          multiple
          label="Terrain Preferences"
          placeholder="Select terrain types…"
          options={terrainOptions}
          value={terrain}
          onChange={setTerrain}
          helperText="Choose all terrain types you're comfortable with."
        />
        {trail && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--tf-text-secondary)",
              margin: 0,
            }}
          >
            Trail:{" "}
            <strong>
              {trailOptions.find((o) => o.value === trail)?.label}
            </strong>
            {terrain.length > 0 && (
              <>
                {" "}
                · Terrain:{" "}
                <strong>
                  {terrain
                    .map(
                      (t) => terrainOptions.find((o) => o.value === t)?.label,
                    )
                    .join(", ")}
                </strong>
              </>
            )}
          </p>
        )}
      </div>
    );
  },
};
