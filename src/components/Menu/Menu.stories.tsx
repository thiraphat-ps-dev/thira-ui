import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen } from 'storybook/test';
import { Button } from '../Button/Button';
import { Menu } from './Menu';

const meta = {
  title: 'Components/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens the menu so the Accessibility panel checks the open state (axe runs after `play`).
 * Highlights the last item (usually the danger one) to check its highlighted contrast too.
 * Waits for the enter transition so contrast isn't measured mid-fade.
 */
const openMenu: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button'));
  const menu = await screen.findByRole('menu');
  await userEvent.keyboard('{ArrowUp}');
  await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  await expect(menu).toBeVisible();
};

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const Basic: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger render={<Button variant="outline" />}>
        Options <ChevronDown />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item disabled>Move to…</Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="danger">Delete</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
  play: openMenu,
};

/** `shortcut` is a visual hint only; add `aria-keyshortcuts` when the shortcut really works. */
export const WithShortcutsAndGroups: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger render={<Button variant="outline" />}>
        Edit <ChevronDown />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>Clipboard</Menu.GroupLabel>
          <Menu.Item shortcut="⌘X">Cut</Menu.Item>
          <Menu.Item shortcut="⌘C">Copy</Menu.Item>
          <Menu.Item shortcut="⌘V" disabled>
            Paste
          </Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.GroupLabel>Item</Menu.GroupLabel>
          <Menu.Item shortcut="⌘D">Duplicate</Menu.Item>
          <Menu.Item tone="danger" shortcut="⌫">
            Delete
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  ),
  play: openMenu,
};

/** Checkbox and radio items stay open on click so several settings can be changed at once. */
export const CheckboxAndRadio: Story = {
  render: function ViewMenu() {
    const [showGrid, setShowGrid] = useState(true);
    const [sort, setSort] = useState('name');
    return (
      <Menu>
        <Menu.Trigger render={<Button variant="outline" />}>
          View <ChevronDown />
        </Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            Show grid
          </Menu.CheckboxItem>
          <Menu.CheckboxItem defaultChecked>Show file sizes</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Group>
            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
            <Menu.RadioGroup
              value={sort}
              onValueChange={(value: string) => {
                setSort(value);
              }}
            >
              <Menu.RadioItem value="name">Name</Menu.RadioItem>
              <Menu.RadioItem value="date">Date modified</Menu.RadioItem>
              <Menu.RadioItem value="size">Size</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Group>
        </Menu.Content>
      </Menu>
    );
  },
  play: openMenu,
};

/** Icon-only triggers need an `aria-label`. */
export const IconTrigger: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger render={<Button variant="ghost" size="sm" aria-label="More actions" />}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3.5" cy="8" r="1.25" />
          <circle cx="8" cy="8" r="1.25" />
          <circle cx="12.5" cy="8" r="1.25" />
        </svg>
      </Menu.Trigger>
      <Menu.Content align="end">
        <Menu.Item>Share</Menu.Item>
        <Menu.Item>Download</Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="danger">Remove</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};
