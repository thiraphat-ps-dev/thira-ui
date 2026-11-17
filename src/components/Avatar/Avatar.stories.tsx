import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

/** Generic placeholder photo, generated inline so stories work offline. */
const PHOTO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#f6c28b"/><stop offset="1" stop-color="#e07a5f"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#fff" opacity=".85"/><path d="M14 80c2-16 13-24 26-24s24 8 26 24z" fill="#fff" opacity=".85"/></svg>',
)}`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
  },
  args: { name: 'Alex Morgan' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const WithImage: Story = { args: { src: PHOTO } };

/** A broken `src` falls back to the initials. */
export const BrokenImage: Story = { args: { src: '/does-not-exist.png' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="lg" shape="square" />
    </div>
  ),
};

export const Thai: Story = { args: { name: 'สมชาย ใจดี', lang: 'th' } };

export const Group: Story = {
  render: () => (
    <Avatar.Group aria-label="Project members">
      <Avatar name="Alex Morgan" src={PHOTO} />
      <Avatar name="Jamie Chen" />
      <Avatar name="Riley Park" />
      <Avatar name="3 more members" fallback="+3" />
    </Avatar.Group>
  ),
};

/** Next to a visible name, leave out `name` so the name isn't read twice. */
export const WithVisibleName: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar fallback="AM" />
      <div>
        <div style={{ fontWeight: 600 }}>Alex Morgan</div>
        <div style={{ color: 'var(--thira-text-muted)', fontSize: 'var(--thira-text-sm)' }}>alex@example.com</div>
      </div>
    </div>
  ),
};

export const Dark: Story = { globals: { theme: 'dark' }, render: Group.render };
