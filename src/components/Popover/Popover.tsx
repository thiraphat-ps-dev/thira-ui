import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Popover.module.css';

export type PopoverProps = ComponentProps<typeof BasePopover.Root>;
export type PopoverTriggerProps = ComponentProps<typeof BasePopover.Trigger>;
export type PopoverCloseProps = ComponentProps<typeof BasePopover.Close>;

export interface PopoverContentProps extends Omit<ComponentProps<typeof BasePopover.Popup>, 'className' | 'title'> {
  /**
   * Heading that names the popup (`aria-labelledby`). Recommended — without it,
   * pass `aria-label` so the dialog still has an accessible name.
   */
  title?: ReactNode;
  /** Supporting text, announced as the popup's description (`aria-describedby`). */
  description?: ReactNode;
  /** Preferred side of the trigger; flips automatically to avoid collisions. */
  side?: ComponentProps<typeof BasePopover.Positioner>['side'];
  /** Distance from the trigger in px. */
  sideOffset?: number;
  align?: ComponentProps<typeof BasePopover.Positioner>['align'];
  alignOffset?: number;
  /** Show a small arrow pointing at the trigger. */
  arrow?: boolean;
  className?: string;
}

function PopoverContent({
  title,
  description,
  side = 'bottom',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  arrow = false,
  className,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        className={styles.positioner}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
      >
        <BasePopover.Popup className={cx(styles.popup, className)} {...props}>
          {arrow && <BasePopover.Arrow className={styles.arrow} />}
          {title ? <BasePopover.Title className={styles.title}>{title}</BasePopover.Title> : null}
          {description ? (
            <BasePopover.Description className={styles.description}>{description}</BasePopover.Description>
          ) : null}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

/**
 * Non-modal popup anchored to a button, built on Base UI. Opens on click, moves focus into
 * the popup, closes on Esc or outside click, and returns focus to the trigger.
 * Use it for small interactive content (forms, settings, share links); for blocking
 * confirmations use `Dialog`, for hover hints use `Tooltip`.
 *
 * ```tsx
 * <Popover>
 *   <Popover.Trigger render={<Button variant="outline" />}>Share</Popover.Trigger>
 *   <Popover.Content title="Share link" description="Anyone with the link can view." arrow>
 *     <Popover.Close render={<Button size="sm" />}>Done</Popover.Close>
 *   </Popover.Content>
 * </Popover>
 * ```
 */
export const Popover = Object.assign(
  function Popover(props: PopoverProps) {
    return <BasePopover.Root {...props} />;
  },
  {
    Trigger: BasePopover.Trigger,
    Content: PopoverContent,
    Close: BasePopover.Close,
  },
);
