import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Progress.module.css';

export type ProgressSize = 'sm' | 'md';
export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressProps extends Omit<ComponentProps<typeof BaseProgress.Root>, 'className' | 'children'> {
  /** Visible label, announced as the progress bar's name. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Show the formatted value (e.g. "40%") next to the label. */
  showValue?: boolean;
  size?: ProgressSize;
  /** Indicator color. The label should still say what the state means. */
  tone?: ProgressTone;
  className?: string;
}

/**
 * Shows how far a task has got: `<Progress label="Uploading" value={40} showValue />`.
 * Pass `value={null}` for an indeterminate bar when the total isn't known yet.
 *
 * It is a `progressbar` for work that moves toward completion. For a static measurement
 * (disk usage, a score), a meter is the right role.
 */
export function Progress({
  label,
  showValue = false,
  size = 'md',
  tone = 'accent',
  className,
  ...props
}: ProgressProps) {
  return (
    <BaseProgress.Root className={cx(styles.root, styles[size], styles[tone], className)} {...props}>
      {(Boolean(label) || showValue) && (
        <div className={styles.header}>
          {label && <BaseProgress.Label className={styles.label}>{label}</BaseProgress.Label>}
          {showValue && <BaseProgress.Value className={styles.value} />}
        </div>
      )}
      <BaseProgress.Track className={styles.track}>
        <BaseProgress.Indicator className={styles.indicator} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
