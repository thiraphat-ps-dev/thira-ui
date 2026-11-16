import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    tone: { control: 'inline-radio', options: ['accent', 'success', 'warning', 'danger'] },
  },
  args: { label: 'Uploading report.pdf', value: 40, showValue: true },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `value={null}` when the total isn't known yet. Pulses instead of sliding under reduced motion. */
export const Indeterminate: Story = { args: { label: 'Preparing export', value: null, showValue: false } };

/** No visible label: name it with `aria-label`. */
export const Small: Story = {
  args: { label: undefined, 'aria-label': 'Lesson progress', size: 'sm', showValue: false },
};

const tones = (
  <div style={{ display: 'grid', gap: 'var(--thira-space-4)' }}>
    <Progress label="Profile complete" value={100} tone="success" showValue />
    <Progress label="Storage used" value={82} tone="warning" showValue />
    <Progress label="Monthly quota" value={97} tone="danger" showValue />
  </div>
);

export const TonesLight: Story = { globals: { theme: 'light' }, render: () => tones };
export const TonesDark: Story = { globals: { theme: 'dark' }, render: () => tones };
