import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Fieldset } from '../Fieldset/Fieldset';
import styles from './Radio.module.css';

export interface RadioProps extends Omit<
  ComponentProps<typeof BaseRadio.Root>,
  'className' | 'render' | 'nativeButton' | 'children'
> {
  /** Visible label, linked to the radio. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Class for the outer wrapper. */
  className?: string;
}

/** A single option inside a `RadioGroup`. */
export function Radio({ label, description, id, className, ...props }: RadioProps) {
  const autoId = useId();
  const radioId = id ?? autoId;
  const descriptionId = `${radioId}-description`;

  return (
    <div className={cx(styles.field, className)}>
      <BaseRadio.Root
        id={radioId}
        nativeButton
        render={<button type="button" />}
        className={styles.radio}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        <BaseRadio.Indicator className={styles.indicator} />
      </BaseRadio.Root>
      {(label ?? description) && (
        <div className={styles.text}>
          {label && (
            <label htmlFor={radioId} className={styles.label}>
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

export interface RadioGroupProps<Value = string> extends Omit<BaseRadioGroup.Props<Value>, 'className'> {
  /** Visible group label, linked with `aria-labelledby`. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the options. */
  hint?: ReactNode;
  /** Error message — marks the group invalid and replaces the hint. */
  error?: ReactNode;
  /** Lay the options out in a column (default) or a row. Arrow keys work in both directions either way. */
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

/** Shares a single selected `value` across child `Radio`s (each needs a `value`). */
export function RadioGroup<Value = string>({
  label,
  hint,
  error,
  orientation = 'vertical',
  required,
  className,
  children,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <Fieldset
      legend={label}
      hint={hint}
      error={error}
      required={required}
      disabled={props.disabled}
      className={cx(styles.group, className)}
      render={<BaseRadioGroup<Value> required={required} {...props} />}
    >
      <div className={styles.items} data-orientation={orientation}>
        {children}
      </div>
    </Fieldset>
  );
}
