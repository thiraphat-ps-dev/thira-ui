import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Announced once as "Loading" (`role="status"` with a visually hidden label). */
export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--thira-text)' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

/** The ring uses `currentColor`, so it follows the surrounding text color. */
export const Colored: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <span style={{ color: 'var(--thira-accent)' }}>
        <Spinner label="Loading results" />
      </span>
      <span style={{ color: 'var(--thira-text-muted)' }}>
        <Spinner label="Loading comments" />
      </span>
    </div>
  ),
};

/** Next to visible text that already announces the state, the spinner is decorative. */
export const WithText: Story = {
  render: () => (
    <p role="status" style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0, color: 'var(--thira-text)' }}>
      <Spinner size="sm" label={null} />
      Syncing your files…
    </p>
  ),
};

/** `<Button loading>` renders a decorative Spinner; the button itself carries `aria-busy`. */
export const InButton: Story = {
  render: () => <Button loading>Saving…</Button>,
};
