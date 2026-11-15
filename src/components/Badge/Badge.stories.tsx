import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone, type BadgeVariant } from './Badge';

const tones: BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger'];
const variants: BadgeVariant[] = ['soft', 'solid', 'outline'];
const labels: Record<BadgeTone, string> = {
  neutral: 'Draft',
  accent: 'New',
  success: 'Paid',
  warning: 'Pending',
  danger: 'Overdue',
};

const meta = {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { children: 'Paid', tone: 'success' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDot: Story = {
  args: { dot: true, children: 'Online' },
};

const grid = (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, auto)',
      gap: 'var(--thira-space-3) var(--thira-space-5)',
      alignItems: 'center',
      padding: 'var(--thira-space-5)',
      background: 'var(--thira-bg)',
      borderRadius: 'var(--thira-radius-lg)',
    }}
  >
    {tones.map((tone) =>
      variants.map((variant) => (
        <Badge key={`${tone}-${variant}`} tone={tone} variant={variant} dot={variant !== 'solid'}>
          {labels[tone]}
        </Badge>
      )),
    )}
  </div>
);

/** Every tone × variant (columns: soft, solid, outline). Text reaches 4.5:1 in both themes. */
export const AllTonesLight: Story = {
  globals: { theme: 'light' },
  render: () => grid,
};

/** The same grid with the dark theme forced. */
export const AllTonesDark: Story = {
  globals: { theme: 'dark' },
  render: () => grid,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--thira-space-3)', alignItems: 'center' }}>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

/** Use `render` to make the badge a link (or any other element); it keeps that element's role. */
export const AsLink: Story = {
  args: {
    tone: 'danger',
    variant: 'outline',
    children: '3 overdue',
    render: <a href="https://example.com/invoices" />,
  },
};
