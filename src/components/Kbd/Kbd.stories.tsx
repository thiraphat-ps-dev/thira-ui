import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md'] } },
  args: { children: 'Esc' },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Write the joiner as text so screen readers say "Ctrl plus K". */
export const Shortcut: Story = {
  render: () => (
    <p style={{ margin: 0 }}>
      Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.
    </p>
  ),
};

/** Symbol keys get a `title` so their meaning is available. */
export const Symbols: Story = {
  render: () => (
    <p style={{ margin: 0, display: 'flex', gap: 'var(--thira-space-2)' }}>
      <Kbd title="Command">⌘</Kbd>
      <Kbd title="Shift">⇧</Kbd>
      <Kbd title="Enter">↵</Kbd>
      <Kbd lang="th">ก</Kbd>
    </p>
  ),
};

export const Sizes: Story = {
  render: () => (
    <p style={{ margin: 0 }}>
      <Kbd size="sm">Tab</Kbd> <Kbd size="md">Tab</Kbd>
    </p>
  ),
};

export const Dark: Story = { globals: { theme: 'dark' }, render: Shortcut.render };
