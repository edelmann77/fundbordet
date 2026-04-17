import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dialog modal rendered via a portal. Supports multiple sizes, optional header and footer, Escape-to-close, and backdrop-click-to-close.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    open: { control: 'boolean' },
    hideCloseButton: { control: 'boolean' },
    disableBackdropClose: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ─── Interactive wrapper ───────────────────────────────────────────────────────

const ModalDemo = (args: React.ComponentProps<typeof Modal>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Trail Conditions',
    children: (
      <p>
        Current trail conditions are excellent. The forest canopy provides natural shade
        throughout the route. Bring at least 2 L of water and wear appropriate footwear.
      </p>
    ),
    footer: (
      <>
        <Button variant="outline" onClick={() => {}}>Cancel</Button>
        <Button variant="primary">Confirm Hike</Button>
      </>
    ),
  },
};

export const NoTitle: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    children: (
      <p>
        A modal without a title — only the close button appears in the header area.
      </p>
    ),
  },
};

export const NoFooter: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Gear Checklist',
    children: (
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        <li>Headlamp &amp; spare batteries</li>
        <li>First aid kit</li>
        <li>Emergency whistle</li>
        <li>Water purification tablets</li>
        <li>Trail map &amp; compass</li>
      </ul>
    ),
  },
};

export const Small: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: { size: 'sm', title: 'Quick Note', children: <p>Small modal for brief messages.</p> },
};

export const Large: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    size: 'lg',
    title: 'Route Details',
    children: (
      <p>
        Large modal for displaying detailed content such as maps, itineraries, or lengthy
        descriptions of your trail route.
      </p>
    ),
    footer: <Button variant="primary">Save Route</Button>,
  },
};

export const DisabledBackdropClose: Story = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: 'Confirm Departure',
    disableBackdropClose: true,
    children: <p>You must use the buttons below — clicking outside will not close this modal.</p>,
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="danger">Abandon Trek</Button>
      </>
    ),
  },
};
