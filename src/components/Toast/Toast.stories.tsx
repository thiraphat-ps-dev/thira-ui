import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen } from 'storybook/test';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './Toast';

/** Toasts need a `<ToastProvider>` at the app root — Storybook's preview already wraps every story in one. */
const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="outline" onClick={() => toast({ title: 'Draft saved', description: 'Last edited just now.' })}>
        Neutral
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ title: 'Published!', description: 'Your changes are now live.', tone: 'success' })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: 'Upload failed', description: 'Check your connection and try again.', tone: 'danger' })
        }
      >
        Danger
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'Project archived',
            description: 'It is now read-only.',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored', tone: 'success' }) },
            duration: 8000,
          })
        }
      >
        With action
      </Button>
    </div>
  );
}

/** Click several times: toasts stack, expand on hover, and can be swiped away. */
export const Playground: Story = {
  args: { children: null },
  render: () => <Demo />,
  // Fires one toast per tone so the Accessibility panel checks visible toasts (axe runs after `play`).
  // Waits for the enter transition so contrast isn't measured mid-fade.
  play: async ({ canvas, userEvent }) => {
    for (const name of ['Neutral', 'Success', 'Danger']) {
      await userEvent.click(canvas.getByRole('button', { name }));
    }
    await screen.findByText('Upload failed');
    await Promise.allSettled(document.getAnimations().map((a) => a.finished));
    await expect(screen.getByText('Draft saved')).toBeVisible();
  },
};
