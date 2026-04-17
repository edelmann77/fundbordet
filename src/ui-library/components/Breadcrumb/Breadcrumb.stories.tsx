import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A lightweight breadcrumb navigation component with accessible semantics, size variants, custom separators, and support for disabled items.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const baseItems = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Navigation", href: "#" },
  { label: "Breadcrumb" },
];

export const Default: Story = {
  args: {
    items: baseItems,
  },
};

export const Small: Story = {
  args: {
    items: baseItems,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    items: baseItems,
    size: "lg",
  },
};

export const ChevronSeparator: Story = {
  args: {
    items: baseItems,
    separator: "›",
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#", disabled: true },
      { label: "Design System", href: "#" },
      { label: "Breadcrumb" },
    ],
  },
};
