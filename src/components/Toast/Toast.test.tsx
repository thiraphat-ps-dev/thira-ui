import { render, renderHook, screen } from '@testing-library/react';
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
          action: onUndo ? { label: 'Undo', altText: 'Undo save', onClick: onUndo } : undefined,
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

  it('respects the limit', async () => {
    render(
      <ToastProvider limit={2}>
        <Trigger />
      </ToastProvider>,
    );
    const notify = screen.getByRole('button', { name: 'Notify' });
    await userEvent.click(notify);
    await userEvent.click(notify);
    await userEvent.click(notify);
    expect(screen.getAllByText('Saved')).toHaveLength(2);
  });

  it('throws a helpful error outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow('useToast must be used inside <ToastProvider>.');
  });
});
