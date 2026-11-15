import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Badge, type BadgeSize, type BadgeTone, type BadgeVariant } from './Badge';

const tones: BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger'];
const variants: BadgeVariant[] = ['soft', 'solid', 'outline'];
const sizes: BadgeSize[] = ['sm', 'md'];

describe('Badge', () => {
  it('renders a span with the default neutral, soft, md classes', () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('badge', 'neutral', 'soft', 'md');
    expect(badge).not.toHaveAttribute('role');
  });

  it.each(tones.flatMap((tone) => variants.map((variant) => [tone, variant] as const)))(
    'applies the %s tone and %s variant classes',
    (tone, variant) => {
      render(
        <Badge tone={tone} variant={variant}>
          Paid
        </Badge>,
      );
      const badge = screen.getByText('Paid');
      expect(badge).toHaveClass('badge', tone, variant);
      for (const other of tones.filter((t) => t !== tone)) expect(badge).not.toHaveClass(other);
      for (const other of variants.filter((v) => v !== variant)) expect(badge).not.toHaveClass(other);
    },
  );

  it.each(sizes)('applies the %s size class', (size) => {
    render(<Badge size={size}>Paid</Badge>);
    const badge = screen.getByText('Paid');
    expect(badge).toHaveClass(size);
    expect(badge).not.toHaveClass(size === 'sm' ? 'md' : 'sm');
  });

  it('renders a decorative dot before the label when `dot` is set', () => {
    render(
      <Badge tone="success" dot>
        Online
      </Badge>,
    );
    const badge = screen.getByText('Online');
    const dot = badge.firstElementChild;
    expect(dot).toHaveClass('dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(badge).toHaveTextContent(/^Online$/);
  });

  it('has no dot by default', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft').children).toHaveLength(0);
  });

  it('renders another element through `render` and keeps its role', () => {
    render(
      <Badge render={<a href="https://example.com/invoices" />} tone="danger" className="custom-badge">
        3 overdue
      </Badge>,
    );
    const link = screen.getByRole('link', { name: '3 overdue' });
    expect(link).toHaveAttribute('href', 'https://example.com/invoices');
    expect(link).toHaveClass('badge', 'danger', 'soft', 'md', 'custom-badge');
  });

  it('merges a custom className', () => {
    render(<Badge className="custom-badge">Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveClass('badge', 'neutral', 'custom-badge');
  });

  it('passes native props through to the element', () => {
    render(
      <Badge id="plan-badge" title="Team plan" data-state="active">
        Team
      </Badge>,
    );
    const badge = screen.getByText('Team');
    expect(badge).toHaveAttribute('id', 'plan-badge');
    expect(badge).toHaveAttribute('title', 'Team plan');
    expect(badge).toHaveAttribute('data-state', 'active');
  });

  it('accepts ref as a prop (React 19)', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Draft</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveTextContent('Draft');
  });

  it('has no axe violations across tones, variants and sizes', async () => {
    render(
      <main>
        {tones.map((tone) =>
          variants.map((variant) => (
            <Badge key={`${tone}-${variant}`} tone={tone} variant={variant} size="sm" dot>
              {`${tone} ${variant}`}
            </Badge>
          )),
        )}
        <Badge render={<a href="https://example.com" />}>Link badge</Badge>
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
