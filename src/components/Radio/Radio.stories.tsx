import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const plans = (
  <>
    <Radio value="starter" label="Starter" />
    <Radio value="team" label="Team" />
    <Radio value="enterprise" label="Enterprise" />
  </>
);

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: { label: 'Plan', defaultValue: 'team', children: plans },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    children: { control: false },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescriptions: Story = {
  args: {
    children: (
      <>
        <Radio value="starter" label="Starter" description="For individuals trying things out." />
        <Radio value="team" label="Team" description="Up to 10 members with shared projects." />
        <Radio value="enterprise" label="Enterprise" description="SSO, audit logs and priority support." />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Billing period',
    defaultValue: 'monthly',
    orientation: 'horizontal',
    children: (
      <>
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </>
    ),
  },
};

export const WithHint: Story = {
  args: { hint: 'You can change your plan at any time.', required: true },
};

export const WithError: Story = {
  args: { defaultValue: undefined, required: true, error: 'Choose a plan to continue.' },
};

export const DisabledItem: Story = {
  args: {
    children: (
      <>
        <Radio value="starter" label="Starter" />
        <Radio value="team" label="Team" />
        <Radio value="enterprise" label="Enterprise" description="Contact sales to enable this plan." disabled />
      </>
    ),
  },
};

export const DisabledGroup: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState('team');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <RadioGroup {...args} defaultValue={undefined} value={value} onValueChange={setValue} />
        <p style={{ margin: 0, fontSize: 14 }}>Selected: {value}</p>
      </div>
    );
  },
};
