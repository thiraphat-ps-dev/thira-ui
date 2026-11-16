import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Stat } from './Stat';

describe('Stat', () => {
  it('is a group named by its label, holding the value and unit', () => {
    render(<Stat label="Accuracy" value="98.5" unit="%" />);
    const group = screen.getByRole('group', { name: 'Accuracy' });
    expect(group).toHaveTextContent('Accuracy98.5%');
    expect(group).toHaveClass('stat', 'stacked', 'outline');
  });

  it('shows a hint', () => {
    render(<Stat label="Words per minute" value={62} hint="Best: 72" />);
    expect(screen.getByRole('group', { name: 'Words per minute' })).toHaveTextContent('Best: 72');
  });

  it('renders zero values and omits an empty unit', () => {
    render(<Stat label="Errors" value={0} />);
    const group = screen.getByRole('group', { name: 'Errors' });
    expect(group).toHaveTextContent(/^Errors0$/);
  });

  it('applies layout, variant and custom classes, and native props', () => {
    render(<Stat label="Time" value="45s" layout="inline" variant="plain" className="custom" data-testid="stat" />);
    expect(screen.getByRole('group', { name: 'Time' })).toHaveClass('inline', 'plain', 'custom');
  });

  it('accepts ref as a prop (React 19)', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stat ref={ref} label="Rounds" value={12} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Stat label="Accuracy" value="98.5" unit="%" hint="Last 10 rounds" />
        <Stat label="Time" value="45s" layout="inline" variant="plain" />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
