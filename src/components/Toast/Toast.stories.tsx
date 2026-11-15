import type { Meta, StoryObj } from '@storybook/react-vite';
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
        onClick={() => toast({ title: 'Published!', description: 'Your article is live on Medium.', tone: 'success' })}
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
};
