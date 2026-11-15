import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('is a status with a default "Loading" name', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('uses a custom label', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument();
  });

  it('is decorative and hidden from assistive tech with label={null}', () => {
    render(<Spinner label={null} data-testid="spinner" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toBeEmptyDOMElement();
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toHaveClass('spinner', size);
  });

  it('defaults to md and merges className', () => {
    render(<Spinner className="custom" />);
    expect(screen.getByRole('status')).toHaveClass('spinner', 'md', 'custom');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Spinner />
        <Spinner label={null} />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
