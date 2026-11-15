import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen } from 'storybook/test';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Dialog } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Opens the dialog so the Accessibility panel checks the open state (axe runs after `play`).
 * Waits for the enter transition so contrast isn't measured mid-fade.
 */
const openDialog: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button'));
  const dialog = await screen.findByRole('dialog');
  await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  await expect(dialog).toBeVisible();
};

export const Confirm: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button variant="danger" />}>Delete project</Dialog.Trigger>
      <Dialog.Content
        size="sm"
        title="Delete this project?"
        description="This permanently removes the project and its history. This cannot be undone."
      >
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
          <Dialog.Close render={<Button variant="danger" />}>Delete</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
  play: openDialog,
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger render={<Button />}>Edit profile</Dialog.Trigger>
      <Dialog.Content title="Edit profile" description="Changes are visible on your public profile.">
        <form
          style={{ display: 'grid', gap: 16, marginTop: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input label="Name" defaultValue="Alex Morgan" />
          <Input label="Website" defaultValue="https://example.com" />
        </form>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
          <Dialog.Close render={<Button />}>Save changes</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
  play: openDialog,
};

/** Control `open` yourself, e.g. to close after an async save. */
export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const save = () => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setOpen(false);
      }, 1200);
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button variant="outline" />}>Open controlled</Dialog.Trigger>
        <Dialog.Content title="Publish changes?" description="Your changes will be visible to everyone.">
          <Dialog.Footer>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
              }}
            >
              Not yet
            </Button>
            <Button loading={saving} onClick={save}>
              {saving ? 'Publishing…' : 'Publish'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
  },
};
