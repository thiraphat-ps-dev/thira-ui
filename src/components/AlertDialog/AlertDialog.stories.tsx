import type { Meta, StoryObj } from '@storybook/react-vite';
import { screen } from 'storybook/test';
import { waitForOpen } from '../../../.storybook/wait-for-open';
import { Button } from '../Button/Button';
import { AlertDialog } from './AlertDialog';

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens the dialog so the Accessibility panel checks the open state; waits for the enter transition. */
const openDialog: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button'));
  const dialog = await screen.findByRole('alertdialog');
  await waitForOpen(dialog);
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialog.Trigger render={<Button variant="danger" />}>Delete project</AlertDialog.Trigger>
      <AlertDialog.Content
        title="Delete this project?"
        description="This permanently removes the project and its history. This cannot be undone."
      >
        <AlertDialog.Footer>
          <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
          <AlertDialog.Close render={<Button variant="danger" />}>Delete</AlertDialog.Close>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
  play: openDialog,
};

export const Discard: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialog.Trigger render={<Button variant="outline" />}>Close editor</AlertDialog.Trigger>
      <AlertDialog.Content title="Discard unsaved changes?" description="Your edits to “Team plan” will be lost.">
        <AlertDialog.Footer>
          <AlertDialog.Close render={<Button variant="ghost" />}>Keep editing</AlertDialog.Close>
          <AlertDialog.Close render={<Button />}>Discard</AlertDialog.Close>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  ),
  play: openDialog,
};

export const Dark: Story = { globals: { theme: 'dark' }, render: Destructive.render, play: openDialog };
