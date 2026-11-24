import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { MinusIcon } from 'thira-icons/react/minus';
import { PlusIcon } from 'thira-icons/react/plus';
import { cx } from '../../utils/cx';
import { ICON_STROKE } from '../../utils/icon';
import { Field, useFieldContext } from '../Field/Field';
import styles from './NumberField.module.css';

export type NumberFieldSize = 'sm' | 'md' | 'lg';

export interface NumberFieldProps extends Omit<
  ComponentProps<typeof BaseNumberField.Root>,
  'className' | 'render' | 'children'
> {
  /** Visible label, linked to the input. Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the field. */
  hint?: ReactNode;
  /** Error message — marks the input invalid and replaces the hint. */
  error?: ReactNode;
  /** Height and font size. */
  size?: NumberFieldSize;
  /** Shown while the input is empty. */
  placeholder?: string;
  /** Accessible name for the decrement button. Default "Decrease". */
  decrementLabel?: string;
  /** Accessible name for the increment button. Default "Increase". */
  incrementLabel?: string;
  /** Accessible name for the input when there is no visible `label`. */
  'aria-label'?: string;
  /** Applied to the wrapper element. */
  className?: string;
}

/**
 * A number input with − / + buttons, built on Base UI's `NumberField` inside a `Field`.
 * Arrow keys step by `step` (Shift: `largeStep`, Alt: `smallStep`), values are clamped to
 * `min`/`max`, and `format` takes `Intl.NumberFormatOptions` (currency, percent, units…).
 * The buttons are skipped by Tab, like a native number input's spin buttons.
 *
 * ```tsx
 * <NumberField label="Seats" defaultValue={5} min={1} max={50} />
 * <NumberField label="Price" format={{ style: 'currency', currency: 'USD' }} />
 * ```
 */
export function NumberField({
  label,
  hint,
  error,
  size = 'md',
  placeholder,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  'aria-label': ariaLabel,
  id,
  required,
  disabled,
  className,
  ...props
}: NumberFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      disabled={disabled}
      messageId={`${inputId}-message`}
      className={className}
    >
      <BaseNumberField.Root id={inputId} required={required} disabled={disabled} {...props}>
        <BaseNumberField.Group className={cx(styles.group, styles[size])}>
          <BaseNumberField.Decrement className={styles.button} aria-label={decrementLabel}>
            <MinusIcon size={16} strokeWidth={ICON_STROKE} />
          </BaseNumberField.Decrement>
          <NumberFieldInput placeholder={placeholder} aria-label={ariaLabel} />
          <BaseNumberField.Increment className={styles.button} aria-label={incrementLabel}>
            <PlusIcon size={16} strokeWidth={ICON_STROKE} />
          </BaseNumberField.Increment>
        </BaseNumberField.Group>
      </BaseNumberField.Root>
    </Field>
  );
}

/**
 * Same Field rules as `Field.Control`: `aria-invalid` follows `error` only (and stays while
 * disabled), and no redundant `aria-labelledby` while a native `<label for>` names the input.
 */
function NumberFieldInput(props: Pick<ComponentProps<'input'>, 'placeholder' | 'aria-label'>) {
  const { invalid, nativeLabel } = useFieldContext();
  return (
    <BaseNumberField.Input
      className={styles.input}
      aria-invalid={invalid || undefined}
      {...(nativeLabel && { 'aria-labelledby': undefined })}
      {...props}
    />
  );
}
