import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './ToggleGroup.module.css';

export type ToggleGroupSize = 'sm' | 'md';

export interface ToggleGroupProps extends Omit<ComponentProps<typeof BaseToggleGroup>, 'className'> {
  size?: ToggleGroupSize;
  /** Stretch to the container's width, with items sharing it equally. */
  fullWidth?: boolean;
  className?: string;
}

export interface ToggleGroupItemProps extends Omit<ComponentProps<typeof BaseToggle>, 'className' | 'nativeButton'> {
  /** Identifies the item in the group's `value` array. */
  value: string;
  className?: string;
}

function ToggleGroupRoot({ size = 'md', fullWidth = false, className, ...props }: ToggleGroupProps) {
  return (
    <BaseToggleGroup
      className={cx(styles.group, styles[size], fullWidth ? styles.fullWidth : undefined, className)}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }: ToggleGroupItemProps) {
  return <BaseToggle className={cx(styles.item, className)} {...props} />;
}

/**
 * A row of toggle buttons sharing one state: a segmented control by default (one pressed at a
 * time), or a set of independent toggles with `multiple`. Arrow keys move between items.
 *
 * `value` is always an array, as in Base UI. In single mode, pressing the pressed item again
 * empties it; to keep one option always chosen, ignore empty arrays in `onValueChange`:
 *
 * ```tsx
 * <ToggleGroup aria-label="View" value={[view]} onValueChange={(v) => { if (v[0]) setView(v[0]); }}>
 *   <ToggleGroup.Item value="list">List</ToggleGroup.Item>
 *   <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 *
 * Give the group an `aria-label` (or `aria-labelledby`), and icon-only items their own `aria-label`.
 */
export const ToggleGroup = Object.assign(ToggleGroupRoot, { Item: ToggleGroupItem });
