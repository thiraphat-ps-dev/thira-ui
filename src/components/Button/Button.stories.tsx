import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Button', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    render: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button {...args} variant="solid">Solid</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** `render` swaps the element but keeps button styles — a link stays a link for screen readers. */
export const AsLink: Story = {
  args: { render: <a href="https://github.com/thiraphat-ps-dev" />, children: 'Visit GitHub', variant: 'outline' },
};

/** Theme any subtree with `data-thira-theme` + a token override — no props, no JS. */
export const CustomHue: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      {[250, 160, 25, 320].map((hue) => (
        <div key={hue} data-thira-theme style={{ '--thira-hue': hue } as CSSProperties}>
          <Button {...args}>Hue {hue}</Button>
        </div>
      ))}
    </div>
  ),
};
