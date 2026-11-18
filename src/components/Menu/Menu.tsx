import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps, ReactNode } from 'react';
import { CheckIcon } from 'thira-icons/react/check';
import { cx } from '../../utils/cx';
import { ICON_STROKE } from '../../utils/icon';
import styles from './Menu.module.css';

export type MenuProps = ComponentProps<typeof BaseMenu.Root>;

function MenuRoot(props: MenuProps) {
  return <BaseMenu.Root {...props} />;
}

export type MenuTriggerProps = ComponentProps<typeof BaseMenu.Trigger>;

export interface MenuContentProps extends Omit<ComponentProps<typeof BaseMenu.Popup>, 'className'> {
  /** Preferred side of the trigger; flips automatically to avoid collisions. */
  side?: ComponentProps<typeof BaseMenu.Positioner>['side'];
  /** Distance from the trigger in px. */
  sideOffset?: number;
  align?: ComponentProps<typeof BaseMenu.Positioner>['align'];
  alignOffset?: number;
  className?: string;
}

function MenuContent({
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  className,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className={styles.positioner}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
      >
        <BaseMenu.Popup className={cx(styles.popup, className)} {...props} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export type MenuItemTone = 'default' | 'danger';

export interface MenuItemProps extends Omit<ComponentProps<typeof BaseMenu.Item>, 'className'> {
  /** `danger` marks destructive actions (e.g. Delete). */
  tone?: MenuItemTone;
  /**
   * Visual keyboard-shortcut hint shown at the end, e.g. `"⌘D"`. Hidden from screen readers
   * so it doesn't pollute the item's name; pass `aria-keyshortcuts` if the shortcut is real.
   */
  shortcut?: ReactNode;
  className?: string;
}

function MenuItem({ tone = 'default', shortcut, className, children, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item className={cx(styles.item, tone === 'danger' && styles.danger, className)} {...props}>
      {children}
      {shortcut != null && (
        <span className={styles.shortcut} aria-hidden="true">
          {shortcut}
        </span>
      )}
    </BaseMenu.Item>
  );
}

export interface MenuCheckboxItemProps extends Omit<ComponentProps<typeof BaseMenu.CheckboxItem>, 'className'> {
  className?: string;
}

function MenuCheckboxItem({ className, children, ...props }: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem className={cx(styles.item, styles.indented, className)} {...props}>
      <BaseMenu.CheckboxItemIndicator className={styles.indicator}>
        <CheckIcon size={16} strokeWidth={ICON_STROKE} />
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export type MenuRadioGroupProps = ComponentProps<typeof BaseMenu.RadioGroup>;

export interface MenuRadioItemProps extends Omit<ComponentProps<typeof BaseMenu.RadioItem>, 'className'> {
  className?: string;
}

function MenuRadioItem({ className, children, ...props }: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem className={cx(styles.item, styles.indented, className)} {...props}>
      <BaseMenu.RadioItemIndicator className={styles.indicator}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </svg>
      </BaseMenu.RadioItemIndicator>
      {children}
    </BaseMenu.RadioItem>
  );
}

export type MenuGroupProps = ComponentProps<typeof BaseMenu.Group>;

export interface MenuGroupLabelProps extends Omit<ComponentProps<typeof BaseMenu.GroupLabel>, 'className'> {
  className?: string;
}

function MenuGroupLabel({ className, ...props }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel className={cx(styles.groupLabel, className)} {...props} />;
}

export interface MenuSeparatorProps extends Omit<ComponentProps<typeof BaseMenu.Separator>, 'className'> {
  className?: string;
}

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator className={cx(styles.separator, className)} {...props} />;
}

/**
 * Dropdown menu of actions (WAI-ARIA menu button pattern) built on Base UI:
 * arrow-key navigation, typeahead, Esc to close, focus returns to the trigger.
 *
 * ```tsx
 * <Menu>
 *   <Menu.Trigger render={<Button variant="outline" />}>Options</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item onClick={rename}>Rename</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item tone="danger" onClick={remove}>Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu>
 * ```
 */
export const Menu = Object.assign(MenuRoot, {
  Trigger: BaseMenu.Trigger,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem: MenuRadioItem,
  Group: BaseMenu.Group,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
});
