import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';

const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    label: 'Company',
    children: <Field.Control placeholder="Acme Inc." />,
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
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'As it appears on invoices.' },
};

export const WithError: Story = {
  args: {
    hint: 'As it appears on invoices.',
    error: 'Company is required.',
  },
};

export const Required: Story = {
  args: {
    required: true,
    hint: 'As it appears on invoices.',
    children: <Field.Control placeholder="Acme Inc." required />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: 'Managed by your workspace admin.',
    children: <Field.Control defaultValue="Acme Inc." />,
  },
};

/** `nativeLabel={false}` labels a non-input Base UI control (here a checkbox) with `aria-labelledby`. */
export const OtherControl: Story = {
  args: {
    label: 'Email me product updates',
    hint: 'About once a month.',
    nativeLabel: false,
    children: (
      <BaseCheckbox.Root
        style={{
          width: 18,
          height: 18,
          border: '1.5px solid var(--thira-text-muted)',
          borderRadius: 4,
          background: 'var(--thira-surface)',
        }}
      />
    ),
  },
};

/** Parts for a custom layout: the error sits above the control. */
export const CustomLayout: Story = {
  args: { label: undefined, invalid: true },
  render: (args) => (
    <Field {...args}>
      <Field.Label required>Tax ID</Field.Label>
      <Field.Error>Enter a 13-digit tax ID.</Field.Error>
      <Field.Control required defaultValue="12345" inputMode="numeric" />
    </Field>
  ),
};
