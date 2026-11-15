import { useId, type ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** `sm` 1rem, `md` 1.5rem, `lg` 2rem. The ring uses `currentColor`. */
  size?: SpinnerSize;
  /**
   * Accessible name announced by screen readers. Defaults to `"Loading"`.
   * Pass `null` to make the spinner purely decorative (`aria-hidden`).
   */
  label?: string | null;
}

/**
 * A rotating ring that indicates work in progress.
 *
 * **Accessibility.** By default the spinner is a `role="status"` live region with a visually
 * hidden label (also its accessible name), so assistive tech announces "Loading" once, politely,
 * without moving focus.
 * Mount it when loading starts rather than toggling its visibility, so the status is announced.
 *
 * When the surrounding UI already communicates loading, pass `label={null}`: the spinner
 * becomes `aria-hidden` and is not announced a second time. Typical cases are a busy button
 * (`<Button loading>` sets `aria-busy` and uses a decorative Spinner internally) or a region
 * marked `aria-busy="true"` that has its own status message.
 *
 * ```tsx
 * <Spinner />                          // announced as "Loading"
 * <Spinner label="Saving changes" />   // custom announcement
 * <Spinner label={null} />             // decorative, hidden from assistive tech
 * ```
 *
 * **Motion.** Rotation is CSS-only. Under `prefers-reduced-motion: reduce` it switches to a slow
 * opacity pulse so the indicator stays visible without spinning.
 */
export function Spinner({ size = 'md', label = 'Loading', className, ...props }: SpinnerProps) {
  const labelId = useId();
  const classes = cx(styles.spinner, styles[size], className);

  if (label === null) {
    return <span aria-hidden="true" className={classes} {...props} />;
  }

  return (
    // The hidden text is what the live region announces; aria-labelledby also gives the status an
    // accessible name (role="status" doesn't take its name from content).
    <span role="status" aria-labelledby={labelId} className={classes} {...props}>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
    </span>
  );
}
