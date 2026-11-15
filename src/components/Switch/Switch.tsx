import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Switch.module.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<
  ComponentProps<typeof BaseSwitch.Root>,
  'className' | 'render' | 'nativeButton'
> {
  /** Visible label, linked to the switch. Without it, pass `aria-label` or `aria-labelledby`. */
  label?: ReactNode;
  /** Helper text shown below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  size?: SwitchSize;
  /** Applied to the wrapper element. */
  className?: string;
}

export function Switch({ label, description, size = 'md', id, className, ...props }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const descriptionId = `${switchId}-description`;

  return (
    <div className={cx(styles.field, styles[size], className)}>
      <BaseSwitch.Root
        id={switchId}
        nativeButton
        render={<button type="button" />}
        className={styles.track}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {(Boolean(label) || Boolean(description)) && (
        <div className={styles.text}>
          {label && (
            <label htmlFor={switchId} className={styles.label}>
              {label}
            </label>
          )}
          {description && (
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
