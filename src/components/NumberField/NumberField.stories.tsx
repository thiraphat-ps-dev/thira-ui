import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberField } from './NumberField';

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  args: { label: 'Seats', defaultValue: 5, min: 1, max: 50 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Up to 50 per workspace.' },
};

/** `format` takes `Intl.NumberFormatOptions`; the value stays a plain number. */
export const Currency: Story = {
  args: {
    label: 'Monthly budget',
    defaultValue: 1200,
    min: 0,
    max: undefined,
    step: 50,
    format: { style: 'currency', currency: 'USD' },
  },
};

export const Percent: Story = {
  args: { label: 'Discount', defaultValue: 0.15, min: 0, max: 1, step: 0.05, format: { style: 'percent' } },
};

export const WithError: Story = {
  args: { defaultValue: undefined, placeholder: '0', required: true, error: 'Enter the number of seats.' },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Managed by your workspace admin.' },
};

/** No visible label: name it with `aria-label`. */
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Quantity', defaultValue: 1 },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <NumberField {...args} size="sm" label="Small" />
      <NumberField {...args} size="md" label="Medium" />
      <NumberField {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<number | null>(3);
    return (
      <NumberField
        {...args}
        label="Guests"
        defaultValue={undefined}
        value={value}
        onValueChange={setValue}
        hint={value === null ? 'No guests yet.' : `${String(value)} guests.`}
      />
    );
  },
};

const themes = (
  <div style={{ display: 'grid', gap: 'var(--thira-space-4)' }}>
    <NumberField label="Seats" defaultValue={5} hint="Up to 50 per workspace." />
    <NumberField label="Guests" placeholder="0" error="Enter the number of guests." />
    <NumberField label="Rooms" defaultValue={2} disabled />
  </div>
);

export const Light: Story = { globals: { theme: 'light' }, render: () => themes };
export const Dark: Story = { globals: { theme: 'dark' }, render: () => themes };
