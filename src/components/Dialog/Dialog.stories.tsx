import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Dialog } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

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
          <Input label="Name" defaultValue="Thiraphat Phutson" />
          <Input label="Website" defaultValue="https://thiraphat-ps-dev.github.io/" />
        </form>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
          <Dialog.Close render={<Button />}>Save changes</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  ),
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
        <Dialog.Content title="Publish article?" description="It will appear on your profile within 6 hours.">
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
