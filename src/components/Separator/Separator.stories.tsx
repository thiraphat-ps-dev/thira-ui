import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <p style={{ margin: '0 0 12px' }}>Team plan</p>
      <Separator {...args} />
      <p style={{ margin: '12px 0 0', color: 'var(--thira-text-muted)' }}>Up to 10 members and shared projects.</p>
    </div>
  ),
};

/** A vertical separator stretches to the height of its flex row. Decorative here: the links already read as a list. */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24 }}>
      <span>Docs</span>
      <Separator orientation="vertical" decorative />
      <span>Pricing</span>
      <Separator orientation="vertical" decorative />
      <span>Blog</span>
    </div>
  ),
};

export const Dark: Story = { globals: { theme: 'dark' }, render: Horizontal.render };
