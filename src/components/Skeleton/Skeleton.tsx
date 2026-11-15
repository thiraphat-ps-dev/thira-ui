import type { ComponentProps, CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends Omit<ComponentProps<'span'>, 'children'> {
  /**
   * `text` is a line of text (1em tall), `rect` a block (full width, 4rem tall by default),
   * `circle` an avatar-like circle (2.5rem). Defaults to `text` when `lines` is set, otherwise `rect`.
   */
  variant?: SkeletonVariant;
  /** CSS length; numbers are pixels. Defaults depend on `variant`. */
  width?: number | string;
  /** CSS length; numbers are pixels. With `lines`, this is the height of each line. */
  height?: number | string;
  /** Border radius; CSS length, numbers are pixels. Defaults depend on `variant`. */
  radius?: number | string;
  /** Text variant only: renders a block of `n` lines, the last one shorter like a real paragraph. */
  lines?: number;
}

const toLength = (value: number | string | undefined) => (typeof value === 'number' ? `${String(value)}px` : value);

/**
 * A placeholder shape shown while content loads, with a CSS-only shimmer
 * (disabled under `prefers-reduced-motion: reduce`).
 *
 * **Accessibility.** Skeletons are always `aria-hidden="true"`: grey boxes mean nothing to a
 * screen reader. Communicate loading on the region instead: mark the container that is being
 * filled with `aria-busy="true"` (assistive tech waits until it's cleared), and announce the
 * state once if needed, e.g. with a `<Spinner />` or visually hidden status text.
 *
 * ```tsx
 * <section aria-busy={loading} aria-label="Team members">
 *   {loading ? (
 *     <>
 *       <Skeleton variant="circle" />
 *       <Skeleton lines={3} />
 *     </>
 *   ) : (
 *     <MemberList members={members} />
 *   )}
 * </section>
 * ```
 */
export function Skeleton({
  variant: variantProp,
  width,
  height,
  radius,
  lines,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variant = variantProp ?? (lines === undefined ? 'rect' : 'text');
  const sizing: CSSProperties = {
    width: toLength(width),
    // A circle keeps its aspect ratio when only `width` is given.
    height: toLength(height ?? (variant === 'circle' ? width : undefined)),
    borderRadius: toLength(radius),
  };

  if (variant === 'text' && lines !== undefined && lines > 1) {
    const lineStyle: CSSProperties = { height: sizing.height, borderRadius: sizing.borderRadius };
    return (
      <span
        aria-hidden="true"
        className={cx(styles.lines, className)}
        style={{ width: sizing.width, ...style }}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={cx(styles.skeleton, styles.text)} style={lineStyle} />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cx(styles.skeleton, styles[variant], className)}
      style={{ ...sizing, ...style }}
      {...props}
    />
  );
}
