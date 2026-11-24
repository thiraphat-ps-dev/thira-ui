import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: { label: 'Volume', defaultValue: 40, showValue: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Applies to all devices.' },
};

/** Two values make a range. Each thumb gets its own name (`thumbLabels`, default "Minimum"/"Maximum"). */
export const Range: Story = {
  args: {
    label: 'Price',
    defaultValue: [200, 800],
    min: 0,
    max: 1000,
    step: 50,
    format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 },
  },
};

export const Steps: Story = {
  args: { label: 'Rating', min: 1, max: 5, step: 0.5, defaultValue: 3.5 },
};

export const WithError: Story = {
  args: { label: 'Budget', defaultValue: 5, hint: 'Minimum 10.', error: 'Budget must be at least 10.' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Managed by your workspace admin.' },
};

/** No visible label: name it with `aria-label`. */
export const NoLabel: Story = {
  args: { label: undefined, showValue: false, 'aria-label': 'Brightness' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Slider {...args} size="sm" label="Small" />
      <Slider {...args} size="md" label="Medium" />
      <Slider {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState([20, 60]);
    return (
      <Slider
        {...args}
        label="Team size"
        defaultValue={undefined}
        value={value}
        onValueChange={(next) => {
          setValue(next as number[]);
        }}
        hint={`Between ${String(value[0])} and ${String(value[1])} people.`}
      />
    );
  },
};

const themes = (
  <div style={{ display: 'grid', gap: 'var(--thira-space-4)' }}>
    <Slider label="Volume" defaultValue={40} showValue />
    <Slider label="Price" defaultValue={[20, 80]} showValue />
    <Slider label="Budget" defaultValue={5} error="Budget must be at least 10." />
  </div>
);

export const Light: Story = { globals: { theme: 'light' }, render: () => themes };
export const Dark: Story = { globals: { theme: 'dark' }, render: () => themes };
