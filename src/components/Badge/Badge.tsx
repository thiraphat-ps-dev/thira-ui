import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cx } from '../../utils/cx';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
export type BadgeVariant = 'soft' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  /** Color of the badge. The text must still say what the color means. */
  tone?: BadgeTone;
  /** `soft` is a tinted background, `solid` a filled one, `outline` a border only. */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Shows a small decorative dot before the label. */
  dot?: boolean;
  className?: string;
}

/**
 * A small status label, e.g. `<Badge tone="success">Paid</Badge>`. Renders a `<span>` by default;
 * use `render` for another element: `<Badge render={<a href="/invoices" />}>3 overdue</Badge>`.
 *
 * Accessibility: a badge is plain text with no role. Color (and the dot) are decorative and must
 * never be the only signal: write the meaning in the label ("Paid", "Overdue"), not just a color.
 * It is not a live region; if a badge changes and that change must be announced, add `role="status"`
 * yourself (or announce it elsewhere, e.g. with a toast).
 */
export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  render,
  className,
  children,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(
      {
        className: cx(styles.badge, styles[tone], styles[variant], styles[size], className),
        children: dot ? (
          <>
            <span className={styles.dot} aria-hidden="true" />
            {children}
          </>
        ) : (
          children
        ),
      },
      props,
    ),
  });
}
