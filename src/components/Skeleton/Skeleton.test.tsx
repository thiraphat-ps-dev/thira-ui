import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is always hidden from assistive tech', () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveAttribute('aria-hidden', 'true');
  });

  it('defaults to the rect variant', () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveClass('skeleton', 'rect');
  });

  it.each(['text', 'rect', 'circle'] as const)('applies the %s variant class', (variant) => {
    render(<Skeleton variant={variant} data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveClass('skeleton', variant);
  });

  it('renders the requested number of text lines', () => {
    render(<Skeleton lines={4} data-testid="sk" />);
    const block = screen.getByTestId('sk');
    expect(block).toHaveAttribute('aria-hidden', 'true');
    expect(block.children).toHaveLength(4);
    for (const line of block.children) expect(line).toHaveClass('skeleton', 'text');
  });

  it('renders a single text line for lines={1}', () => {
    render(<Skeleton lines={1} data-testid="sk" />);
    const line = screen.getByTestId('sk');
    expect(line).toHaveClass('skeleton', 'text');
    expect(line.children).toHaveLength(0);
  });

  it('applies width, height and radius (numbers as px)', () => {
    render(<Skeleton width={120} height="2rem" radius={4} data-testid="sk" />);
    const { style } = screen.getByTestId('sk');
    expect(style.width).toBe('120px');
    expect(style.height).toBe('2rem');
    expect(style.borderRadius).toBe('4px');
  });

  it('keeps a circle round when only width is given', () => {
    render(<Skeleton variant="circle" width={48} data-testid="sk" />);
    expect(screen.getByTestId('sk')).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('applies width to the block and height to each line', () => {
    render(<Skeleton lines={2} width="50%" height={10} data-testid="sk" />);
    const block = screen.getByTestId('sk');
    expect(block).toHaveStyle({ width: '50%' });
    for (const line of block.children) expect(line).toHaveStyle({ height: '10px' });
  });

  it('merges className and style', () => {
    render(<Skeleton className="custom" width={80} style={{ marginTop: 8 }} data-testid="sk" />);
    const sk = screen.getByTestId('sk');
    expect(sk).toHaveClass('skeleton', 'rect', 'custom');
    expect(sk).toHaveStyle({ width: '80px', marginTop: '8px' });
  });

  it('has no axe violations inside an aria-busy region', async () => {
    render(
      <section aria-busy="true" aria-label="Team members">
        <Skeleton variant="circle" />
        <Skeleton lines={3} />
        <Skeleton />
      </section>,
    );
    expect(screen.getByRole('region', { name: 'Team members' })).toHaveAttribute('aria-busy', 'true');
    await expect(document.body).toHaveNoAxeViolations();
  });
});
