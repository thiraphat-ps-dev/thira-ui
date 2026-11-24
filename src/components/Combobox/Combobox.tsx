import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { useId, useMemo, type ReactNode } from 'react';
import { CheckIcon } from 'thira-icons/react/check';
import { ChevronDownIcon } from 'thira-icons/react/chevron-down';
import { XIcon } from 'thira-icons/react/x';
import { cx } from '../../utils/cx';
import { ICON_STROKE } from '../../utils/icon';
import { Field, useFieldContext } from '../Field/Field';
import styles from './Combobox.module.css';

/** Item values are ids (strings or numbers), so the value can be compared and submitted with a form. */
export type ComboboxValue = string | number;

export interface ComboboxItemData<Value extends ComboboxValue = string> {
  value: Value;
  /** Shown in the list and the input, and matched against what the user types. */
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps<Value extends ComboboxValue = string> {
  /** Options as data. Filtered client-side by `label` as the user types. */
  items: readonly ComboboxItemData<Value>[];
  /** Visible label, linked to the input. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the input. */
  hint?: ReactNode;
  /** Error message — marks the input invalid and replaces the hint. */
  error?: ReactNode;
  /** Shown in the input while it is empty. */
  placeholder?: string;
  /** Shown in the popup when nothing matches. Default "No results". */
  emptyMessage?: ReactNode;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (value: Value | null, eventDetails: BaseCombobox.Root.ChangeEventDetails) => void;
  /** Field name for form submission (submits the item's `value`). */
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name for the clear button. Default "Clear". */
  clearLabel?: string;
  /** Accessible name for the button that opens the list when there is no visible `label` (with one, the label names it). Default "Show options". */
  triggerLabel?: string;
  /** Accessible name for the input when there is no visible `label`. */
  'aria-label'?: string;
  id?: string;
  className?: string;
}

/**
 * Choose one value from a list you can filter by typing, built on Base UI's `Combobox`
 * (input + listbox popup, arrow keys, Enter to pick, Esc to close). Strict: the value is always
 * one of `items` or `null` — typed text that doesn't match is not a value.
 *
 * Use `Select` for short lists; use this when there are enough options that typing helps.
 *
 * ```tsx
 * <Combobox
 *   label="Country"
 *   placeholder="Search countries"
 *   items={[{ value: 'th', label: 'Thailand' }, { value: 'jp', label: 'Japan' }]}
 * />
 * ```
 */
export function Combobox<Value extends ComboboxValue = string>({
  items,
  label,
  hint,
  error,
  placeholder,
  emptyMessage = 'No results',
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  readOnly,
  required,
  size = 'md',
  clearLabel = 'Clear',
  triggerLabel = 'Show options',
  'aria-label': ariaLabel,
  id,
  className,
}: ComboboxProps<Value>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  // Select the item's `value` (an id), not the item object; filter and display by `label`.
  const collection = useMemo(
    () =>
      BaseCombobox.createItems([...items], {
        getValue: (item) => item.value,
        getLabel: (item) => item.label,
      }),
    [items],
  );

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      disabled={disabled}
      // While the popup is open Base UI hides the rest of the page from assistive tech, label
      // included; `aria-labelledby` (unlike `<label for>`) still names the input from a hidden label.
      nativeLabel={false}
      messageId={`${inputId}-message`}
      className={className}
    >
      <BaseCombobox.Root
        id={inputId}
        items={collection}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={name}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
      >
        <BaseCombobox.InputGroup className={cx(styles.group, styles[size])}>
          <ComboboxInput placeholder={placeholder} aria-label={ariaLabel} />
          <div className={styles.actions}>
            <BaseCombobox.Clear className={styles.button} aria-label={clearLabel}>
              <XIcon size={16} strokeWidth={ICON_STROKE} />
            </BaseCombobox.Clear>
            <BaseCombobox.Trigger className={cx(styles.button, styles.trigger)} aria-label={triggerLabel}>
              <ChevronDownIcon size={16} strokeWidth={ICON_STROKE} />
            </BaseCombobox.Trigger>
          </div>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner className={styles.positioner} sideOffset={6}>
            <BaseCombobox.Popup className={styles.popup}>
              <BaseCombobox.Empty className={styles.empty}>{emptyMessage}</BaseCombobox.Empty>
              <BaseCombobox.List className={styles.list}>
                {(item: ComboboxItemData<Value>) => (
                  <BaseCombobox.Item
                    key={String(item.value)}
                    value={item.value}
                    disabled={item.disabled}
                    className={styles.item}
                  >
                    <BaseCombobox.ItemIndicator className={styles.indicator}>
                      <CheckIcon size={16} strokeWidth={ICON_STROKE} />
                    </BaseCombobox.ItemIndicator>
                    <span className={styles.itemText}>{item.label}</span>
                  </BaseCombobox.Item>
                )}
              </BaseCombobox.List>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </Field>
  );
}

/** Same Field rules as `Field.Control`: `aria-invalid` follows `error` only; no redundant `aria-labelledby`. */
function ComboboxInput(props: { placeholder?: string; 'aria-label'?: string }) {
  const { invalid, nativeLabel } = useFieldContext();
  return (
    <BaseCombobox.Input
      className={styles.input}
      aria-invalid={invalid || undefined}
      {...(nativeLabel && { 'aria-labelledby': undefined })}
      {...props}
    />
  );
}
