import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'I agree to the terms' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { label: 'Select all', indeterminate: true },
};

export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Get a weekly summary of activity in your workspace.',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox {...args} disabled label="Disabled" />
      <Checkbox {...args} disabled defaultChecked label="Disabled and checked" />
    </div>
  ),
};

export const WithoutVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Select row' },
};

const toppings = ['Cheese', 'Mushrooms', 'Olives'];

export const Group: Story = {
  render: function GroupStory() {
    const [value, setValue] = useState<string[]>(['Cheese']);
    return (
      <CheckboxGroup label="Toppings" value={value} onValueChange={setValue}>
        {toppings.map((name) => (
          <Checkbox key={name} value={name} label={name} />
        ))}
      </CheckboxGroup>
    );
  },
};

export const ParentCheckbox: Story = {
  render: function ParentStory() {
    const [value, setValue] = useState<string[]>(['Mushrooms']);
    return (
      <CheckboxGroup aria-label="Toppings" value={value} onValueChange={setValue} allValues={toppings}>
        <Checkbox parent label="All toppings" />
        <div style={{ display: 'grid', gap: 12, paddingInlineStart: 26 }}>
          {toppings.map((name) => (
            <Checkbox key={name} value={name} label={name} />
          ))}
        </div>
      </CheckboxGroup>
    );
  },
};
