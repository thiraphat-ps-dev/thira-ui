import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

const meta = {
  title: 'Components/Stat',
  component: Stat,
  argTypes: {
    layout: { control: 'inline-radio', options: ['stacked', 'inline'] },
    variant: { control: 'inline-radio', options: ['outline', 'plain'] },
  },
  args: { label: 'Monthly revenue', value: '$12,480', hint: '+8% from last month' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithUnit: Story = { args: { label: 'Uptime', value: '99.95', unit: '%', hint: 'Last 30 days' } };

const row = (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 'var(--thira-space-3)',
      width: 640,
    }}
  >
    <Stat label="Active users" value="1,204" />
    <Stat label="Conversion" value="3.4" unit="%" />
    <Stat label="Avg. response" value="182" unit="ms" />
    <Stat label="Open tickets" value={7} hint="2 urgent" />
  </div>
);

/** A dashboard row. */
export const GroupLight: Story = { globals: { theme: 'light' }, render: () => row };
export const GroupDark: Story = { globals: { theme: 'dark' }, render: () => row };

/** `inline` puts the label and value on one line, for compact panels. */
export const Inline: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--thira-space-2)', width: 260 }}>
      <Stat layout="inline" label="Words per minute" value={62} />
      <Stat layout="inline" label="Accuracy" value="98.5" unit="%" />
      <Stat layout="inline" label="Time" value="45s" />
    </div>
  ),
};

export const Plain: Story = { args: { variant: 'plain' } };
