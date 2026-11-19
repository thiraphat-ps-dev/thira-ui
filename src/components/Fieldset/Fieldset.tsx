import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Fieldset.module.css';

export interface FieldsetProps extends Omit<ComponentProps<typeof BaseFieldset.Root>, 'className'> {
  /** Visible group label, linked with `aria-labelledby`. Without it, pass `aria-label`. */
  legend?: ReactNode;
  /** Helper text shown below the group, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error message — marks the group invalid (`aria-invalid`) and replaces the hint. */
  error?: ReactNode;
  /** Shows the required marker on the legend. */
  required?: boolean;
  /** `id` for the hint/error element. Default: generated. */
  messageId?: string;
  className?: string;
}

/**
 * Groups related fields under one legend, built on Base UI's `Fieldset`. Renders a native
 * `<fieldset>` (so `disabled` disables every control inside); use `render` to make another
 * group element, e.g. a Base UI `RadioGroup`, the fieldset.
 *
 * ```tsx
 * <Fieldset legend="Billing details" hint="Shown on invoices.">
 *   <Input label="Company" />
 *   <Input label="Tax ID" />
 * </Fieldset>
 * ```
 */
function FieldsetRoot({
  legend,
  hint,
  error,
  required = false,
  messageId: messageIdProp,
  className,
  children,
  ...props
}: FieldsetProps) {
  const autoMessageId = useId();
  const messageId = messageIdProp ?? autoMessageId;
  const message = error ?? hint;

  return (
    <BaseFieldset.Root
      className={cx(styles.fieldset, className)}
      aria-describedby={message ? messageId : undefined}
      aria-invalid={error ? true : undefined}
      {...props}
    >
      {legend && <FieldsetLegend required={required}>{legend}</FieldsetLegend>}
      {children}
      {message && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {message}
        </p>
      )}
    </BaseFieldset.Root>
  );
}

export interface FieldsetLegendProps extends Omit<ComponentProps<typeof BaseFieldset.Legend>, 'className'> {
  /** Adds a red `*` hidden from assistive tech. */
  required?: boolean;
  className?: string;
}

/** The group's label. Renders a `<div>` that names the fieldset via `aria-labelledby`. */
function FieldsetLegend({ required = false, className, children, ...props }: FieldsetLegendProps) {
  return (
    <BaseFieldset.Legend className={cx(styles.legend, className)} {...props}>
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </BaseFieldset.Legend>
  );
}

/** Compound fieldset: `<Fieldset legend hint error>` or `<Fieldset><Fieldset.Legend/>…</Fieldset>`. */
export const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend,
});
