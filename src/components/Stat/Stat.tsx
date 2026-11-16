import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Stat.module.css';

export type StatLayout = 'stacked' | 'inline';
export type StatVariant = 'outline' | 'plain';

export interface StatProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** What the number is, e.g. "Words per minute". */
  label: ReactNode;
  value: ReactNode;
  /** Shown after the value in a smaller size, e.g. "%" or "ms". */
  unit?: ReactNode;
  /** Extra context under the value, e.g. "Best: 72". */
  hint?: ReactNode;
  /** `stacked`: label above the value. `inline`: label left, value right. */
  layout?: StatLayout;
  /** `outline` draws a bordered box; `plain` has none, for use inside a Card. */
  variant?: StatVariant;
}

/**
 * A labelled number for dashboards and summaries: `<Stat label="Accuracy" value="98.5" unit="%" />`.
 *
 * It renders a `group` named by its label, so a screen reader announces "Accuracy, group,
 * 98.5 %". It is not a live region: if the value updates on its own and that matters, announce
 * it elsewhere (or add `aria-live="polite"` yourself for slow-changing values).
 */
export function Stat({
  label,
  value,
  unit,
  hint,
  layout = 'stacked',
  variant = 'outline',
  className,
  ...props
}: StatProps) {
  const labelId = useId();
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={cx(styles.stat, styles[layout], styles[variant], className)}
      {...props}
    >
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <span className={styles.value}>
        {value}
        {unit != null && <span className={styles.unit}>{unit}</span>}
      </span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
