import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A fully accessible text input with label, helper text, error handling, password toggle, and icon support.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
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
type Story = StoryObj<typeof TextInput>;

// ─── Base stories ─────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Trail Name',
    placeholder: 'e.g. Pacific Crest Trail',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Campsite Location',
    placeholder: '40.7128° N, 74.0060° W',
    helperText: 'Enter GPS coordinates or a recognisable landmark name.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Emergency Contact',
    placeholder: 'Phone number',
    value: 'not-a-number',
    error: 'Please enter a valid phone number.',
  },
};

export const Required: Story = {
  args: {
    label: 'Hiker Name',
    placeholder: 'Your full name',
    required: true,
    helperText: 'Required for the trail register.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Permit Number',
    value: 'PCT-2024-00847',
    helperText: 'Permit numbers cannot be changed after booking.',
    disabled: true,
  },
};

// ─── Size stories ─────────────────────────────────────────────────────────────

export const Small: Story = {
  args: {
    label: 'Search',
    placeholder: 'Find a trail…',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Search',
    placeholder: 'Find a trail…',
    size: 'lg',
  },
};

// ─── Type stories ─────────────────────────────────────────────────────────────

export const Password: Story = {
  args: {
    label: 'Account Password',
    placeholder: 'Enter password',
    type: 'password',
    helperText: 'Minimum 8 characters.',
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'trailblazer@wilderness.com',
    type: 'email',
  },
};

// ─── Icon stories ─────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    label: 'Search Trails',
    placeholder: 'Mountain, forest, coastal…',
    leftIcon: <SearchIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Meetup Point',
    placeholder: 'Drop a pin or type an address',
    rightIcon: <LocationIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Trail Search',
    placeholder: 'Search by name or region',
    leftIcon: <SearchIcon />,
    rightIcon: <LocationIcon />,
  },
};

// ─── Combined showcase ────────────────────────────────────────────────────────

export const TrailForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px' }}>
      <TextInput
        label="Hiker Name"
        placeholder="Your full name"
        required
      />
      <TextInput
        label="Email"
        type="email"
        placeholder="you@trailhead.com"
      />
      <TextInput
        label="Password"
        type="password"
        placeholder="Create a password"
        helperText="At least 8 characters."
      />
      <TextInput
        label="Starting Elevation (ft)"
        type="number"
        placeholder="e.g. 5,280"
        leftIcon={
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
            <path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" />
          </svg>
        }
      />
      <TextInput
        label="Permit Number"
        value="PCT-2024-00847"
        helperText="Cannot be changed after booking."
        disabled
      />
    </div>
  ),
};
