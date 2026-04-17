import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible card component for displaying grouped content. Supports images, titles, footers, and four visual variants.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '380px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Base stories ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Pacific Crest Trail',
    subtitle: 'California · 2,650 miles',
    children:
      'One of the longest hiking trails in the world, stretching from the Mexican border all the way to Canada through diverse terrain.',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: 'Gear Checklist',
    subtitle: 'Essential equipment for your next trip',
    children: 'Tent, sleeping bag, trekking poles, first-aid kit, water filter, and emergency shelter.',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    title: 'Weather Advisory',
    subtitle: 'Updated 2 hours ago',
    children: 'Afternoon thunderstorms expected above 10,000 ft. Plan to be below tree line by noon.',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    title: 'Trail Conditions',
    subtitle: 'Last reported: this morning',
    children: 'Snow patches remain near the summit. Microspikes recommended. Trail is otherwise clear.',
  },
};

// ─── Feature stories ──────────────────────────────────────────────────────────

export const WithImage: Story = {
  args: {
    title: 'Mount Rainier',
    subtitle: 'Cascade Range, Washington',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    imageAlt: 'Snow-capped Mount Rainier reflecting in a mountain lake',
    children:
      'Standing at 14,411 feet, Mount Rainier is the highest peak in the Cascades and a challenging multi-day mountaineering objective.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Yosemite Valley Loop',
    subtitle: '7.2 miles · Moderate',
    children:
      'A classic valley floor hike passing Bridalveil Fall, El Capitan Meadow, and Sentinel Beach. Perfect for first-time visitors.',
    footer: (
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
        <Button variant="primary" size="sm">
          Start Planning
        </Button>
        <Button variant="ghost" size="sm">
          Save Trail
        </Button>
      </div>
    ),
  },
};

export const WithImageAndFooter: Story = {
  args: {
    title: 'Torres del Paine',
    subtitle: 'Patagonia, Chile · 5-day circuit',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    imageAlt: 'The iconic towers of Torres del Paine at sunrise',
    children:
      'The W Trek through this UNESCO Biosphere Reserve offers dramatic views of granite spires, glaciers, and turquoise lakes.',
    footer: (
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: '#5C4A3A' }}>⭐ 4.9 · 2,340 reviews</span>
        <Button variant="primary" size="sm">Explore</Button>
      </div>
    ),
  },
};

// ─── Grid showcase ────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        maxWidth: '800px',
      }}
    >
      {(['default', 'elevated', 'outlined', 'filled'] as const).map((variant) => (
        <Card
          key={variant}
          variant={variant}
          title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Card`}
          subtitle="Trail summary"
        >
          Each variant has its own border and shadow treatment, all using outdoor theme tokens.
        </Card>
      ))}
    </div>
  ),
};
