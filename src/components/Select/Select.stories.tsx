import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen } from 'storybook/test';
import { Select } from './Select';

const plans = [
  { value: 'free', label: 'Free' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Plan', placeholder: 'Choose a plan', items: plans },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          // Intentional Base UI behavior, not a bug: while the popup is open, Base UI renders
          // visually hidden `aria-hidden` focus-guard spans (tabindex=0) around the trigger and
          // popup that immediately redirect focus to keep Tab order correct for the portaled
          // popup. axe's static scan flags them; they never hold focus.
          { id: 'aria-hidden-focus', enabled: false },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens the select so the Accessibility panel checks the open popup (axe runs after `play`).
 * Waits for the enter transition so contrast isn't measured mid-fade.
 */
const openSelect: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('combobox'));
  const listbox = await screen.findByRole('listbox');
  await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  await expect(listbox).toBeVisible();
};

export const Default: Story = {};

export const Open: Story = {
  args: { defaultValue: 'team', hint: 'You can change your plan at any time.' },
  play: openSelect,
};

/** Compose options as children instead of `items`. */
export const WithChildren: Story = {
  render: (args) => (
    <Select {...args} items={undefined} defaultValue="team">
      <Select.Item value="free">Free</Select.Item>
      <Select.Item value="team">Team</Select.Item>
      <Select.Item value="enterprise" disabled>
        Enterprise (contact sales)
      </Select.Item>
    </Select>
  ),
  play: openSelect,
};

export const Grouped: Story = {
  render: () => (
    <Select label="Assignee" placeholder="Unassigned">
      <Select.Group>
        <Select.GroupLabel>Design</Select.GroupLabel>
        <Select.Item value="alex">Alex Morgan</Select.Item>
        <Select.Item value="sam">Sam Lee</Select.Item>
      </Select.Group>
      <Select.Group>
        <Select.GroupLabel>Engineering</Select.GroupLabel>
        <Select.Item value="jordan">Jordan Kim</Select.Item>
        <Select.Item value="riley">Riley Chen</Select.Item>
      </Select.Group>
    </Select>
  ),
  play: openSelect,
};

export const WithError: Story = {
  args: { required: true, error: 'Please choose a plan.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'team' },
};

/** Without a visible label, give the trigger an `aria-label`. */
export const NoVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Plan', defaultValue: 'free' },
};

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState<string | null>('free');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Select label="Plan" items={plans} value={value} onValueChange={setValue} />
        <span style={{ fontSize: 14 }}>Selected: {value ?? 'none'}</span>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Select {...args} size="sm" label="Small" />
      <Select {...args} size="md" label="Medium" />
      <Select {...args} size="lg" label="Large" />
    </div>
  ),
};
