import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { Tooltip } from './Tooltip';

function Example() {
  return (
    <Tooltip>
      <Tooltip.Trigger delay={0} render={<Button variant="outline" />}>
        Share
      </Tooltip.Trigger>
      <Tooltip.Content>Copy a link to this page</Tooltip.Content>
    </Tooltip>
  );
}

describe('Tooltip', () => {
  it('shows on hover and hides when the pointer leaves', async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(screen.getByRole('button', { name: 'Share' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Copy a link to this page');

    await user.unhover(screen.getByRole('button', { name: 'Share' }));
    await vi.waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows on keyboard focus and describes the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription('Copy a link to this page');
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Share' })).not.toHaveAttribute('aria-describedby');
  });

  it('keeps the trigger semantics of the rendered element', () => {
    render(
      <Tooltip>
        <Tooltip.Trigger render={<Button render={<a href="https://example.com/docs" />} />}>Docs</Tooltip.Trigger>
        <Tooltip.Content>Open the documentation</Tooltip.Content>
      </Tooltip>,
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });
});
