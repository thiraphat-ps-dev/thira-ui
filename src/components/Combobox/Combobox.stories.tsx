import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { screen } from 'storybook/test';
import { waitForOpen } from '../../../.storybook/wait-for-open';
import { Combobox } from './Combobox';

const countries = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'jo', label: 'Jordan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'mx', label: 'Mexico' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'sg', label: 'Singapore' },
  { value: 'th', label: 'Thailand' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: { label: 'Country', placeholder: 'Search countries', items: countries },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    items: { control: false },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          // Same as Select: while the popup is open Base UI renders `aria-hidden` focus-guard spans
          // (tabindex=0) that immediately redirect focus. axe's static scan flags them.
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
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Types into the input so the Accessibility panel checks the open, filtered popup (axe runs after `play`). */
/** The popup (it carries `data-starting-style`), found from something inside it. */
const popupOf = (el: Element) => el.closest('[data-side]') ?? el;

const typeToFilter =
  (text: string): Story['play'] =>
  async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), text);
    await waitForOpen(popupOf(await screen.findByRole('listbox')));
  };

export const Default: Story = {};

export const Filtered: Story = {
  args: { hint: 'Where the invoice is sent.' },
  play: typeToFilter('ja'),
};

export const Selected: Story = {
  args: { defaultValue: 'th' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Country' }));
    await waitForOpen(popupOf(await screen.findByRole('listbox')));
  },
};

/** Nothing matches: the popup shows `emptyMessage`. */
export const Empty: Story = {
  args: { emptyMessage: 'No countries found' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'zz');
    await waitForOpen(popupOf(await screen.findByText('No countries found')));
  },
};

export const WithError: Story = {
  args: { required: true, error: 'Choose a country.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'jp' },
};

/** Without a visible label, give the input an `aria-label`. */
export const NoVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Country' },
};

export const Controlled: Story = {
  render: function ControlledCombobox() {
    const [value, setValue] = useState<string | null>('ca');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Combobox label="Country" items={countries} value={value} onValueChange={setValue} />
        <span style={{ fontSize: 14 }}>Selected: {value ?? 'none'}</span>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Combobox {...args} size="sm" label="Small" />
      <Combobox {...args} size="md" label="Medium" />
      <Combobox {...args} size="lg" label="Large" />
    </div>
  ),
};
