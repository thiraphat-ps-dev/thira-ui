import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Email notifications' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: { description: 'Get a weekly summary of activity in your workspace.' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch {...args} disabled label="Disabled off" />
      <Switch {...args} disabled defaultChecked label="Disabled on" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch {...args} size="sm" label="Small" />
      <Switch {...args} size="md" label="Medium" />
      <Switch {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithoutVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Wi-Fi' },
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Switch {...args} label="Auto-save drafts" checked={checked} onCheckedChange={setChecked} />
        <span style={{ fontFamily: 'var(--thira-font)', fontSize: 14 }}>Auto-save is {checked ? 'on' : 'off'}.</span>
      </div>
    );
  },
};
