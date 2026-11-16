import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ToggleGroup } from './ToggleGroup';

function Views({ onChange }: { onChange?: (v: string[]) => void }) {
  return (
    <ToggleGroup aria-label="View" defaultValue={['list']} onValueChange={onChange}>
      <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
      <ToggleGroup.Item value="board" disabled>
        Board
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('renders a labelled group of pressed-state buttons', () => {
    render(<Views />);
    expect(screen.getByRole('group', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('presses one item at a time by default', async () => {
    const onChange = vi.fn();
    render(<Views onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Grid' }));
    expect(onChange).toHaveBeenLastCalledWith(['grid'], expect.anything());
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('lets several items be pressed with `multiple`', async () => {
    render(
      <ToggleGroup aria-label="Text style" multiple>
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('can keep one option always chosen when controlled', async () => {
    function Required() {
      const [view, setView] = useState('list');
      return (
        <ToggleGroup
          aria-label="View"
          value={[view]}
          onValueChange={(v) => {
            if (v[0]) setView(v[0]);
          }}
        >
          <ToggleGroup.Item value="list">List</ToggleGroup.Item>
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        </ToggleGroup>
      );
    }
    render(<Required />);
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('moves focus with the arrow keys and skips disabled items', async () => {
    render(<Views />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Board' })).toBeDisabled();
  });

  it('applies size and full-width classes', () => {
    render(
      <ToggleGroup aria-label="Size" size="sm" fullWidth className="custom">
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      </ToggleGroup>,
    );
    expect(screen.getByRole('group', { name: 'Size' })).toHaveClass('group', 'sm', 'fullWidth', 'custom');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Views />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
