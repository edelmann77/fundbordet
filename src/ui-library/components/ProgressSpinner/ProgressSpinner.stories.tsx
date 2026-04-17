import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../Card";
import { ProgressSpinner } from "./ProgressSpinner";

const meta: Meta<typeof ProgressSpinner> = {
  title: "Components/ProgressSpinner",
  component: ProgressSpinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An outdoor-inspired loading indicator that feels like a trail beacon: a rotating path, orbiting markers, and a pulsing core for discovery and scanning states.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: "select",
      options: ["forest", "earth", "sky"],
    },
    label: { control: "text" },
    showLabel: { control: "boolean" },
  },
  args: {
    size: "md",
    tone: "forest",
    label: "Scanning the trail…",
    showLabel: false,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressSpinner>;

export const Default: Story = {};

export const Labeled: Story = {
  args: {
    label: "Searching nearby findings…",
    showLabel: true,
    tone: "sky",
  },
};

export const Tones: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <ProgressSpinner tone="forest" showLabel label="Trail scan" />
      <ProgressSpinner tone="earth" showLabel label="Ground check" />
      <ProgressSpinner tone="sky" showLabel label="Range sweep" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <Card
      title="Preparing findings"
      subtitle="We are triangulating likely outdoor matches around your route."
      style={{ maxWidth: "28rem" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <ProgressSpinner tone="forest" size="lg" />
        <div>
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
            Sweeping terrain signals
          </div>
          <div style={{ color: "var(--tf-text-secondary)" }}>
            Comparing trail markers, shelter points, and nearby features.
          </div>
        </div>
      </div>
    </Card>
  ),
};
