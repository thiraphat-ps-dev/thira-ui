import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('is a progressbar named by its label, with the value', () => {
    render(<Progress label="Uploading" value={40} showValue />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('hides the value text unless asked', () => {
    render(<Progress label="Uploading" value={40} />);
    expect(screen.queryByText('40%')).not.toBeInTheDocument();
  });

  it('takes an aria-label when there is no visible label', () => {
    render(<Progress aria-label="Lesson progress" value={3} max={10} />);
    expect(screen.getByRole('progressbar', { name: 'Lesson progress' })).toHaveAttribute('aria-valuenow', '3');
  });

  it('is indeterminate when the value is null', () => {
    render(<Progress label="Loading" value={null} />);
    const bar = screen.getByRole('progressbar', { name: 'Loading' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('marks completion', () => {
    render(<Progress label="Done" value={100} />);
    expect(screen.getByRole('progressbar', { name: 'Done' })).toHaveAttribute('data-complete');
  });

  it('applies size, tone and custom classes', () => {
    render(<Progress label="Quota" value={90} size="sm" tone="danger" className="custom" />);
    expect(screen.getByRole('progressbar', { name: 'Quota' })).toHaveClass('root', 'sm', 'danger', 'custom');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Progress label="Uploading" value={40} showValue />
        <Progress aria-label="Loading" value={null} />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
