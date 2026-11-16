import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders a native kbd element', () => {
    render(<Kbd>Esc</Kbd>);
    const key = screen.getByText('Esc');
    expect(key.tagName).toBe('KBD');
    expect(key).toHaveClass('kbd', 'md');
  });

  it('reads a shortcut as plain text', () => {
    render(
      <p>
        Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search
      </p>,
    );
    expect(screen.getByText(/to search/)).toHaveTextContent('Press Ctrl + K to search');
  });

  it('applies the size class, a custom class and native props', () => {
    render(
      <Kbd size="sm" className="custom" title="Command">
        ⌘
      </Kbd>,
    );
    const key = screen.getByTitle('Command');
    expect(key).toHaveClass('kbd', 'sm', 'custom');
    expect(key).not.toHaveClass('md');
  });

  it('accepts ref as a prop (React 19)', () => {
    const ref = createRef<HTMLElement>();
    render(<Kbd ref={ref}>Tab</Kbd>);
    expect(ref.current?.tagName).toBe('KBD');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <p>
          <Kbd>Shift</Kbd> + <Kbd size="sm">Enter</Kbd>
        </p>
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
