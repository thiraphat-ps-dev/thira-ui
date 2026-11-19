import { Field as BaseField } from '@base-ui/react/field';
import { useId, useState, type ChangeEvent, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Field, fieldControlProps, useFieldContext } from '../Field/Field';
import styles from './Textarea.module.css';

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Visible label, linked to the textarea. */
  label?: ReactNode;
  /** Helper text shown below the textarea. */
  hint?: ReactNode;
  /** Error message — marks the textarea invalid and replaces the hint. */
  error?: ReactNode;
  /** Padding and font size. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Grow with the content using CSS `field-sizing: content`, between `minRows` and `maxRows`.
   * No JavaScript measuring: browsers without `field-sizing` keep a fixed `minRows` height
   * (users can still drag to resize vertically).
   */
  autoResize?: boolean;
  /** Smallest height in rows when `autoResize` is on. Default `2`. */
  minRows?: number;
  /** Largest height in rows when `autoResize` is on; content scrolls beyond it. Default: no limit. */
  maxRows?: number;
  /** Show a character counter below the field: `n / maxLength`, or just `n` without `maxLength`. */
  showCount?: boolean;
}

export function Textarea({
  label,
  hint,
  error,
  size = 'md',
  autoResize = false,
  minRows = 2,
  maxRows,
  showCount = false,
  id,
  className,
  required,
  disabled,
  ref,
  rows,
  style,
  value,
  defaultValue,
  onChange,
  maxLength,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const messageId = `${textareaId}-message`;
  const countId = `${textareaId}-count`;
  const message = error ?? hint;
  const hasMessage = Boolean(message);

  // Uncontrolled length is tracked here; a controlled `value` always wins.
  const [uncontrolledLength, setUncontrolledLength] = useState(() => toText(defaultValue).length);
  const length = value !== undefined ? toText(value).length : uncontrolledLength;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (showCount) setUncontrolledLength(event.currentTarget.value.length);
    onChange?.(event);
  };

  const resizeVars: Record<string, number> | undefined = autoResize
    ? {
        '--thira-textarea-min-rows': minRows,
        ...(maxRows !== undefined && { '--thira-textarea-max-rows': maxRows }),
      }
    : undefined;

  return (
    <Field label={label} invalid={Boolean(error)} required={required} disabled={disabled} className={className}>
      <TextareaControl
        ref={ref}
        id={textareaId}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        countId={showCount ? countId : undefined}
        ownProps={props}
        textareaProps={{
          className: cx(
            styles.textarea,
            styles[size],
            autoResize && styles.autoResize,
            autoResize && maxRows !== undefined && styles.maxRows,
          ),
          required,
          rows: rows ?? (autoResize ? minRows : undefined),
          maxLength,
          onChange: handleChange,
          style: resizeVars ? { ...resizeVars, ...style } : style,
        }}
      />
      {(hasMessage || showCount) && (
        <div className={styles.footer}>
          <Field.Message id={messageId} hint={hint} error={error} />
          {/*
            No aria-live on purpose: announcing on every keystroke talks over what the user types.
            The counter is in aria-describedby, so screen readers read it when the field is focused,
            and the native `maxLength` already stops input at the limit.
          */}
          {showCount && (
            <p id={countId} className={styles.count}>
              <span aria-hidden="true">
                {maxLength !== undefined ? `${String(length)} / ${String(maxLength)}` : String(length)}
              </span>
              <span className={styles.visuallyHidden}>
                {maxLength !== undefined
                  ? `${String(length)} of ${String(maxLength)} characters used`
                  : `${String(length)} characters`}
              </span>
            </p>
          )}
        </div>
      )}
    </Field>
  );
}

type TextareaElementProps = ComponentProps<'textarea'>;

/**
 * The `<textarea>` as a Base UI `Field.Control`. The counter isn't a `Field.Description`: its id is
 * appended here so it always comes after the hint/error in `aria-describedby`.
 */
function TextareaControl({
  ref,
  id,
  disabled,
  value,
  defaultValue,
  countId,
  ownProps,
  textareaProps,
}: Pick<TextareaElementProps, 'ref' | 'id' | 'disabled' | 'value' | 'defaultValue'> & {
  countId?: string;
  ownProps: TextareaElementProps;
  textareaProps: TextareaElementProps;
}) {
  const context = useFieldContext();
  return (
    <BaseField.Control
      ref={ref}
      id={id}
      disabled={disabled}
      value={value}
      defaultValue={defaultValue}
      render={(fieldProps) => {
        const base = fieldProps as TextareaElementProps;
        const describedBy = [base['aria-describedby'], countId].filter(Boolean).join(' ') || undefined;
        return (
          <textarea
            {...fieldControlProps<TextareaElementProps>(context, base, ownProps, {
              ...textareaProps,
              'aria-describedby': describedBy,
            })}
          />
        );
      }}
    />
  );
}

function toText(value: ComponentProps<'textarea'>['value']): string {
  if (value === undefined) return '';
  return Array.isArray(value) ? value.join(',') : String(value);
}
