import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Popover } from './Popover';

function Example() {
  return (
    <Popover>
      <Popover.Trigger render={<Button variant="outline" />}>Share</Popover.Trigger>
      <Popover.Content title="Share link" description="Anyone with the link can view this page." arrow>
        <Input label="Link" defaultValue="https://example.com/p/42" readOnly />
        <Popover.Close render={<Button size="sm" />}>Done</Popover.Close>
      </Popover.Content>
    </Popover>
  );
}

describe('Popover', () => {
  it('opens on click with an accessible name and description', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: 'Share link' });
    expect(popup).toHaveAccessibleDescription('Anyone with the link can view this page.');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves focus into the popup, and Escape closes it and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share' });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await vi.waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Link' })).toHaveFocus();
    });

    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it('closes from Popover.Close', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Share' }));
    await user.click(await screen.findByRole('button', { name: 'Done' }));
    await vi.waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Share' })).toHaveFocus();
  });

  it('closes on an outside click', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Example />
        <button type="button">Elsewhere</button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Share' }));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await vi.waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('supports controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Popover
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          >
            <Popover.Trigger render={<Button />}>Filters</Popover.Trigger>
            <Popover.Content aria-label="Filters">Only active items</Popover.Content>
          </Popover>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Show filters
          </Button>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    // Opened from outside, without the trigger.
    await user.click(screen.getByRole('button', { name: 'Show filters' }));
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    // document.body, because the popup is portaled outside the render container.
    await expect(document.body).toHaveNoAxeViolations();
  });
});
