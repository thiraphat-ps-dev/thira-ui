import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentProps } from 'react';
import { expect, screen } from 'storybook/test';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    a11y: {
      config: {
        rules: [
          // Intentional Base UI behavior (same as Select): while the popup is open, Base UI renders
          // visually hidden `aria-hidden` focus-guard spans (tabindex=0) that immediately redirect
          // focus to keep Tab order correct for the portaled popup. They never hold focus.
          { id: 'aria-hidden-focus', enabled: false },
        ],
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens the popover so the Accessibility panel checks the open state (axe runs after `play`).
 * Waits for the enter transition so contrast isn't measured mid-fade.
 */
const openPopover: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button'));
  const popup = await screen.findByRole('dialog');
  await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  await expect(popup).toBeVisible();
};

export const Basic: Story = {
  render: () => (
    <div style={{ padding: 48 }}>
      <Popover>
        <Popover.Trigger render={<Button variant="outline" />}>Share</Popover.Trigger>
        <Popover.Content title="Share link" description="Anyone with the link can view this page." arrow>
          <div style={{ display: 'grid', gap: 12 }}>
            <Input label="Link" defaultValue="https://example.com/p/42" readOnly />
            <Popover.Close render={<Button size="sm" />}>Done</Popover.Close>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  ),
  play: openPopover,
};

export const Settings: Story = {
  render: () => (
    <div style={{ padding: 48 }}>
      <Popover>
        <Popover.Trigger render={<Button variant="outline" />}>Notifications</Popover.Trigger>
        <Popover.Content title="Notifications" align="start">
          <div style={{ display: 'grid', gap: 12 }}>
            <Switch label="Email updates" defaultChecked />
            <Switch label="Weekly summary" />
          </div>
        </Popover.Content>
      </Popover>
    </div>
  ),
  play: openPopover,
};

const sides: NonNullable<ComponentProps<typeof Popover.Content>['side']>[] = ['top', 'right', 'bottom', 'left'];

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, padding: 120 }}>
      {sides.map((side) => (
        <Popover key={side}>
          <Popover.Trigger render={<Button variant="outline" />}>{side}</Popover.Trigger>
          <Popover.Content side={side} arrow aria-label={`Popover on the ${side}`}>
            Shown on the {side}
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
};

/** Control `open` yourself, e.g. to close after saving. */
export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('Team plan');
    return (
      <div style={{ padding: 48 }}>
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger render={<Button variant="outline" />}>Rename: {name}</Popover.Trigger>
          <Popover.Content title="Rename workspace">
            <form
              style={{ display: 'grid', gap: 12 }}
              onSubmit={(e) => {
                e.preventDefault();
                const value = new FormData(e.currentTarget).get('name');
                if (typeof value === 'string' && value.trim()) setName(value.trim());
                setOpen(false);
              }}
            >
              <Input label="Name" name="name" defaultValue={name} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Popover.Close render={<Button variant="ghost" size="sm" />}>Cancel</Popover.Close>
                <Button type="submit" size="sm">
                  Save
                </Button>
              </div>
            </form>
          </Popover.Content>
        </Popover>
      </div>
    );
  },
  play: openPopover,
};
