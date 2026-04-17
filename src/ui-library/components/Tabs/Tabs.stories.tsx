import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A tab component for organising content into labelled sections. Supports line and pill variants, keyboard navigation (←/→/Home/End), disabled tabs, and both controlled and uncontrolled usage.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["line", "pill"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ─── Shared tab data ──────────────────────────────────────────────────────────

const trailTabs = [
  {
    value: "overview",
    label: "Overview",
    children: (
      <p className="text-[var(--tf-text-secondary)]">
        A scenic 12 km loop through old-growth forest with 450 m of elevation
        gain. Suitable for intermediate hikers. Dogs allowed on-leash.
      </p>
    ),
  },
  {
    value: "conditions",
    label: "Conditions",
    children: (
      <p className="text-[var(--tf-text-secondary)]">
        Trail is currently dry and well-maintained. Snow patches possible above
        1 200 m until late June. Trekking poles recommended.
      </p>
    ),
  },
  {
    value: "gear",
    label: "Gear",
    children: (
      <ul
        style={{ margin: 0, paddingLeft: "1.25rem" }}
        className="text-[var(--tf-text-secondary)]"
      >
        <li>2 L water minimum</li>
        <li>Layered clothing</li>
        <li>First aid kit</li>
        <li>Headlamp &amp; spare batteries</li>
      </ul>
    ),
  },
  {
    value: "closed",
    label: "Closed Section",
    disabled: true,
    children: null,
  },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Line: Story = {
  args: {
    tabs: trailTabs,
    variant: "line",
    defaultValue: "overview",
  },
};

export const Pill: Story = {
  args: {
    tabs: trailTabs,
    variant: "pill",
    defaultValue: "overview",
  },
};

export const Small: Story = {
  args: {
    tabs: trailTabs,
    variant: "line",
    size: "sm",
    defaultValue: "overview",
  },
};

export const Large: Story = {
  args: {
    tabs: trailTabs,
    variant: "pill",
    size: "lg",
    defaultValue: "overview",
  },
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState("conditions");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--tf-text-secondary)",
          }}
        >
          Active tab: <strong>{active}</strong>
        </p>
        <Tabs
          tabs={trailTabs}
          variant="line"
          value={active}
          onChange={setActive}
        />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div>
        <p style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Line</p>
        <Tabs tabs={trailTabs} variant="line" defaultValue="overview" />
      </div>
      <div>
        <p style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Pill</p>
        <Tabs tabs={trailTabs} variant="pill" defaultValue="gear" />
      </div>
    </div>
  ),
};
