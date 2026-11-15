import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button/Button';
import { Menu } from './Menu';

function Example({ onRename = () => {}, onDelete = () => {} }: { onRename?: () => void; onDelete?: () => void }) {
  return (
    <Menu>
      <Menu.Trigger render={<Button variant="outline" />}>Options</Menu.Trigger>
      <Menu.Content>
        <Menu.Item onClick={onRename} shortcut="F2">
          Rename
        </Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item disabled>Archive</Menu.Item>
        <Menu.Separator />
        <Menu.Item tone="danger" onClick={onDelete}>
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}

const trigger = () => screen.getByRole('button', { name: 'Options' });

describe('Menu', () => {
  it('opens on click and lists its items', async () => {
    const user = userEvent.setup();
    render(<Example />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(trigger());
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'RenameF2',
      'Duplicate',
      'Archive',
      'Delete',
    ]);
  });

  it('keeps the shortcut hint out of the accessible name', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(await screen.findByRole('menuitem', { name: 'Rename' })).toBeInTheDocument();
  });

  it.each(['{Enter}', '{ArrowDown}'])('opens with %s and highlights the first item', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    trigger().focus();
    await user.keyboard(key);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await vi.waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    });
  });

  it('moves between items with the arrow keys, including disabled ones', async () => {
    const user = userEvent.setup();
    render(<Example />);
    trigger().focus();
    await user.keyboard('{ArrowDown}');
    await vi.waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    });

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    // Disabled items stay focusable (WAI-ARIA menu pattern) so they're discoverable.
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
  });

  it('calls onClick and closes when an item is activated', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    const onDelete = vi.fn();
    render(<Example onRename={onRename} onDelete={onDelete} />);

    await user.click(trigger());
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }));
    expect(onRename).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    // Keyboard activation
    trigger().focus();
    await user.keyboard('{ArrowUp}'); // opens and highlights the last item
    await vi.waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    });
    await user.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    trigger().focus();
    await user.keyboard('{Enter}');
    await vi.waitFor(() => {
      expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    });

    await user.keyboard('{Escape}');
    await vi.waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
    expect(trigger()).toHaveFocus();
  });

  it('does not activate disabled items', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Menu>
        <Menu.Trigger render={<Button variant="outline" />}>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled onClick={onClick}>
            Archive
          </Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    await user.click(trigger());
    const archive = await screen.findByRole('menuitem', { name: 'Archive' });
    expect(archive).toHaveAttribute('aria-disabled', 'true');

    await user.click(archive);
    archive.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('toggles checkbox and radio items', async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <Menu.Trigger render={<Button variant="outline" />}>View</Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem defaultChecked>Show grid</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Group>
            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
            <Menu.RadioGroup defaultValue="name">
              <Menu.RadioItem value="name">Name</Menu.RadioItem>
              <Menu.RadioItem value="date">Date</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Group>
        </Menu.Content>
      </Menu>,
    );
    await user.click(screen.getByRole('button', { name: 'View' }));

    const grid = await screen.findByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(grid).toBeChecked();
    await user.click(grid);
    expect(grid).not.toBeChecked();

    expect(screen.getByRole('group', { name: 'Sort by' })).toBeInTheDocument();
    const date = screen.getByRole('menuitemradio', { name: 'Date' });
    await user.click(date);
    expect(date).toBeChecked();
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).not.toBeChecked();
  });

  it('has no axe violations when open', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    // document.body, because the menu is portaled outside the render container.
    await expect(document.body).toHaveNoAxeViolations();
  });
});
