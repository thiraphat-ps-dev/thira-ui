import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

function Trigger({ onUndo }: { onUndo?: () => void }) {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast({
          title: 'Saved',
          description: 'Your changes are live.',
          tone: 'success',
          action: onUndo ? { label: 'Undo', onClick: onUndo } : undefined,
        })
      }
    >
      Notify
    </button>
  );
}

describe('Toast', () => {
  it('shows a toast with title and description', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
  });

  it('runs the action callback', async () => {
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Trigger onUndo={onUndo} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('marks toasts beyond the limit as limited', async () => {
    render(
      <ToastProvider limit={2}>
        <Trigger />
      </ToastProvider>,
    );
    const notify = screen.getByRole('button', { name: 'Notify' });
    await userEvent.click(notify);
    await userEvent.click(notify);
    await userEvent.click(notify);
    const limited = document.querySelectorAll('[data-limited]');
    expect(limited).toHaveLength(1);
  });

  it('closes from the dismiss button', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
    // Base UI hides the close button from the a11y tree (toasts are dismissed via swipe/Esc for AT users).
    await userEvent.click(document.querySelector<HTMLButtonElement>('button[aria-label="Dismiss"]')!);
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  });

  it('throws outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow();
  });
});
