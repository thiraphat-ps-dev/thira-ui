import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Button } from '../Button/Button';
import { AlertDialog } from './AlertDialog';

function Example({ onDelete = () => undefined }: { onDelete?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger render={<Button variant="danger" />}>Delete project</AlertDialog.Trigger>
      <AlertDialog.Content title="Delete this project?" description="This cannot be undone.">
        <AlertDialog.Footer>
          <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
          <AlertDialog.Close render={<Button variant="danger" />} onClick={onDelete}>
            Delete
          </AlertDialog.Close>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}

const open = () => userEvent.click(screen.getByRole('button', { name: 'Delete project' }));

describe('AlertDialog', () => {
  it('opens an alertdialog with a name and description, without a × button', async () => {
    render(<Example />);
    await open();
    const dialog = screen.getByRole('alertdialog', { name: 'Delete this project?' });
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('runs the action and closes', async () => {
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('cancels with Escape', async () => {
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    await open();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('has no axe violations when open', async () => {
    render(<Example />);
    await open();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await expect(document.body).toHaveNoAxeViolations();
  });
});
