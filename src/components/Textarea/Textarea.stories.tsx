import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { label: 'Message', placeholder: 'Tell us a bit more…' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Markdown is not supported.' },
};

export const WithError: Story = {
  args: { error: 'Please write at least 20 characters.', defaultValue: 'Too short' },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'This feedback was already submitted.' },
};

export const WithCounter: Story = {
  args: {
    label: 'Bio',
    hint: 'Shown on your public profile.',
    maxLength: 160,
    showCount: true,
    defaultValue: 'Alex Morgan, product designer on the Team plan.',
  },
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    minRows: 2,
    maxRows: 6,
    hint: 'Grows from 2 to 6 rows, then scrolls. Fixed height in browsers without field-sizing.',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Textarea {...args} size="sm" label="Small" />
      <Textarea {...args} size="md" label="Medium" />
      <Textarea {...args} size="lg" label="Large" />
    </div>
  ),
};
