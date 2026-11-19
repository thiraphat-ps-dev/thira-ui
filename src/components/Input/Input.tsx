import { useId, type ComponentProps, type ReactNode } from 'react';
import { Field } from '../Field/Field';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  /** Visible label, linked to the input. */
  label?: ReactNode;
  /** Helper text shown below the input. */
  hint?: ReactNode;
  /** Error message — marks the input invalid and replaces the hint. */
  error?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/** A labelled text input: `Field` + `Field.Control` in one component. */
export function Input({ label, hint, error, size = 'md', id, className, required, disabled, ...props }: InputProps) {
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
      <Field.Control id={inputId} size={size} required={required} disabled={disabled} {...props} />
    </Field>
  );
}
