import { Select as BaseSelect } from '@base-ui/react/select';
import { Children, isValidElement, useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Select.module.css';

export interface SelectItemData<Value = string> {
  value: Value;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<Value = string> extends Omit<
  BaseSelect.Root.Props<Value>,
  'multiple' | 'items' | 'children' | 'value' | 'defaultValue'
> {
  /** Visible label, linked to the trigger. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the trigger. */
  hint?: ReactNode;
  /** Error message — marks the select invalid and replaces the hint. */
  error?: ReactNode;
  /** Shown in the trigger while nothing is selected. */
  placeholder?: ReactNode;
  value?: Value | null;
  defaultValue?: Value | null;
  /** Options as data. Rendered as `Select.Item`s when there are no `children`. */
  items?: readonly SelectItemData<Value>[];
  /** `Select.Item`s, optionally inside `Select.Group`s. */
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Overlap the trigger so the selected item lines up with it (like a native macOS select).
   * Off by default: the popup opens below the trigger.
   */
  alignItemWithTrigger?: boolean;
  /** Accessible name for the trigger when there is no visible `label`. */
  'aria-label'?: string;
  className?: string;
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface SelectItemProps extends Omit<ComponentProps<typeof BaseSelect.Item>, 'className'> {
  className?: string;
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item className={cx(styles.item, className)} {...props}>
      <BaseSelect.ItemIndicator className={styles.indicator}>
        <CheckIcon />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className={styles.itemText}>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

export interface SelectGroupProps extends Omit<ComponentProps<typeof BaseSelect.Group>, 'className'> {
  className?: string;
}

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <BaseSelect.Group className={cx(styles.group, className)} {...props} />;
}

export interface SelectGroupLabelProps extends Omit<ComponentProps<typeof BaseSelect.GroupLabel>, 'className'> {
  className?: string;
}

function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
  return <BaseSelect.GroupLabel className={cx(styles.groupLabel, className)} {...props} />;
}

/**
 * Base UI's `Select.Value` shows the raw value unless it gets an `items` lookup.
 * Build that lookup from the `Select.Item`s in `children` (also inside groups/fragments),
 * so the trigger shows "Team" rather than "team".
 */
function collectItems(children: ReactNode, out: SelectItemData<unknown>[] = []) {
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: unknown; children?: ReactNode }>(child)) return;
    if (child.type === SelectItem) {
      out.push({ value: child.props.value, label: child.props.children });
    } else {
      collectItems(child.props.children, out);
    }
  });
  return out;
}

function SelectRoot<Value = string>({
  label,
  hint,
  error,
  placeholder,
  items,
  children,
  size = 'md',
  alignItemWithTrigger = false,
  'aria-label': ariaLabel,
  className,
  required,
  ...props
}: SelectProps<Value>) {
  const messageId = `${useId()}-message`;
  const message = error ?? hint;
  const lookup = items ?? collectItems(children);

  return (
    <div className={cx(styles.field, className)}>
      <BaseSelect.Root<Value> items={lookup as SelectItemData<Value>[]} required={required} {...props}>
        {label && (
          <BaseSelect.Label className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </BaseSelect.Label>
        )}
        <BaseSelect.Trigger
          className={cx(styles.trigger, styles[size])}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
        >
          <BaseSelect.Value className={styles.value} placeholder={placeholder} />
          <BaseSelect.Icon className={styles.icon}>
            <ChevronIcon />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            className={styles.positioner}
            sideOffset={6}
            alignItemWithTrigger={alignItemWithTrigger}
          >
            <BaseSelect.Popup className={styles.popup}>
              <BaseSelect.List className={styles.list}>
                {children ??
                  items?.map((item) => (
                    <SelectItem key={String(item.value)} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </SelectItem>
                  ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {message && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {message}
        </p>
      )}
    </div>
  );
}

/**
 * Choose one value from a dropdown list, built on Base UI (combobox trigger + listbox popup,
 * keyboard navigation and typeahead, hidden input for forms).
 *
 * ```tsx
 * <Select label="Plan" defaultValue="team">
 *   <Select.Item value="free">Free</Select.Item>
 *   <Select.Item value="team">Team</Select.Item>
 * </Select>
 *
 * <Select label="Plan" items={[{ value: 'free', label: 'Free' }]} />
 * ```
 */
export const Select = Object.assign(SelectRoot, {
  Item: SelectItem,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
});
