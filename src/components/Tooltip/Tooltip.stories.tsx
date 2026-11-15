import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { Button } from '../Button/Button';
import { Tooltip, TooltipProvider } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const icons = {
  copy: 'M5.5 5.5V3a1 1 0 0 1 1-1H13a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-2.5M3 5.5h6.5a1 1 0 0 1 1 1V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z',
  edit: 'M10.5 2.5l3 3L6 13H3v-3l7.5-7.5Z',
  trash: 'M2.5 4h11M6.5 4V2.5h3V4M4 4l.75 9.5h6.5L12 4',
};

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button variant="outline" />}>Hover or focus me</Tooltip.Trigger>
      <Tooltip.Content>Saves a copy to your workspace</Tooltip.Content>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger render={<Button variant="outline" />}>With arrow</Tooltip.Trigger>
      <Tooltip.Content arrow>Team plan includes 10 seats</Tooltip.Content>
    </Tooltip>
  ),
};

const sides: NonNullable<ComponentProps<typeof Tooltip.Content>['side']>[] = ['top', 'right', 'bottom', 'left'];

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 48 }}>
      {sides.map((side) => (
        <Tooltip key={side}>
          <Tooltip.Trigger render={<Button variant="outline" />}>{side}</Tooltip.Trigger>
          <Tooltip.Content side={side} arrow>
            Shown on the {side}
          </Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Icon-only buttons still need their own `aria-label`; the tooltip is a visual hint.
 * Inside a `TooltipProvider`, moving between triggers opens the next tooltip instantly.
 */
export const IconToolbar: Story = {
  render: () => (
    <TooltipProvider delay={400}>
      <div role="toolbar" aria-label="Item actions" style={{ display: 'flex', gap: 4 }}>
        {(
          [
            ['Copy', icons.copy],
            ['Edit', icons.edit],
            ['Delete', icons.trash],
          ] as const
        ).map(([label, d]) => (
          <Tooltip key={label}>
            <Tooltip.Trigger render={<Button variant="ghost" size="sm" aria-label={label} />}>
              <Icon d={d} />
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">{label}</Tooltip.Content>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

/** Rendered open so the accessibility checks cover the popup in both themes. */
export const Open: Story = {
  render: () => (
    <div style={{ padding: 48 }}>
      <Tooltip defaultOpen>
        <Tooltip.Trigger render={<Button variant="outline" />}>Always open</Tooltip.Trigger>
        <Tooltip.Content arrow>Last updated 5 minutes ago</Tooltip.Content>
      </Tooltip>
    </div>
  ),
};
