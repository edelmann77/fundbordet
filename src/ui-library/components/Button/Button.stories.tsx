import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A versatile button component with outdoor-inspired styling. Supports multiple variants, sizes, icons and a loading state.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Base stories ─────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Start Your Trail',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Find Shelter',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'View Map',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn More',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Abandon Trek',
  },
};

// ─── Size stories ─────────────────────────────────────────────────────────────

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

// ─── State stories ────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading…',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width CTA',
  },
};

// ─── Icon stories ─────────────────────────────────────────────────────────────

export const WithLeftIcon: Story = {
  args: {
    children: 'Summit',
    leftIcon: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Continue',
    rightIcon: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    ),
  },
};

// ─── All variants showcase ────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
