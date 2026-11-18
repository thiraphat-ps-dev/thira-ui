import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { CheckIcon } from 'thira-icons/react/check';
import { MinusIcon } from 'thira-icons/react/minus';
import { cx } from '../../utils/cx';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<
  ComponentProps<typeof BaseCheckbox.Root>,
  'className' | 'render' | 'nativeButton' | 'children'
> {
  /** Visible label, linked to the checkbox. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Class for the outer wrapper. */
  className?: string;
}

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const autoId = useId();
  const checkboxId = id ?? autoId;
  const descriptionId = `${checkboxId}-description`;

  return (
    <div className={cx(styles.field, className)}>
      <BaseCheckbox.Root
        id={checkboxId}
        nativeButton
        render={<button type="button" />}
        className={styles.box}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        <BaseCheckbox.Indicator className={styles.indicator}>
          <CheckIcon className={styles.check} />
          <MinusIcon className={styles.dash} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {(label ?? description) && (
        <div className={styles.text}>
          {label && (
            <label htmlFor={checkboxId} className={styles.label}>
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

export interface CheckboxGroupProps extends Omit<ComponentProps<typeof BaseCheckboxGroup>, 'className'> {
  /** Visible group label, linked with `aria-labelledby`. Without it, pass `aria-label`. */
  label?: ReactNode;
  className?: string;
}

/** Shares `value: string[]` state across child `Checkbox`es (each needs a `value`). */
export function CheckboxGroup({ label, className, children, ...props }: CheckboxGroupProps) {
  const labelId = useId();
  return (
    <BaseCheckboxGroup className={cx(styles.group, className)} aria-labelledby={label ? labelId : undefined} {...props}>
      {label && (
        <div id={labelId} className={styles.groupLabel}>
          {label}
        </div>
      )}
      {children}
    </BaseCheckboxGroup>
  );
}
