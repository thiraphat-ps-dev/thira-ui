import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../Input/Input';
import { Fieldset } from './Fieldset';

const meta = {
  title: 'Components/Fieldset',
  component: Fieldset,
  args: {
    legend: 'Billing details',
    children: (
      <>
        <Input label="Company" placeholder="Acme Inc." />
        <Input label="Tax ID" inputMode="numeric" />
      </>
    ),
  },
  argTypes: {
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Shown on every invoice.' },
};

export const WithError: Story = {
  args: {
    error: 'Fix the highlighted fields.',
    required: true,
    children: (
      <>
        <Input label="Company" error="Company is required." required />
        <Input label="Tax ID" inputMode="numeric" />
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Managed by your workspace admin.' },
};
