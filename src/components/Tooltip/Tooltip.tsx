import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { createContext, use, useId, useState, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Tooltip.module.css';

/*
 * Base UI's tooltip is visual-only: it sets no `role="tooltip"` and no `aria-describedby`.
 * We wire both up (WAI-ARIA tooltip pattern) so the content is announced as the trigger's
 * description while it's open. Icon-only triggers still need their own `aria-label`.
 */
interface TooltipContextValue {
  id: string;
  open: boolean;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(part: string) {
  const ctx = use(TooltipContext);
  if (!ctx) throw new Error(`<Tooltip.${part}> must be used inside <Tooltip>.`);
  return ctx;
}

export type TooltipProps = ComponentProps<typeof BaseTooltip.Root>;

function TooltipRoot({ open, defaultOpen = false, onOpenChange, ...props }: TooltipProps) {
  const id = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  return (
    <TooltipContext value={{ id, open: isOpen }}>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next, details) => {
          setUncontrolledOpen(next);
          onOpenChange?.(next, details);
        }}
        {...props}
      />
    </TooltipContext>
  );
}

export type TooltipTriggerProps = ComponentProps<typeof BaseTooltip.Trigger>;

function TooltipTrigger(props: TooltipTriggerProps) {
  const { id, open } = useTooltipContext('Trigger');
  return <BaseTooltip.Trigger aria-describedby={open ? id : undefined} {...props} />;
}

export interface TooltipContentProps extends Omit<ComponentProps<typeof BaseTooltip.Popup>, 'className' | 'id'> {
  /** Preferred side of the trigger; flips automatically to avoid collisions. */
  side?: ComponentProps<typeof BaseTooltip.Positioner>['side'];
  /** Distance from the trigger in px. */
  sideOffset?: number;
  align?: ComponentProps<typeof BaseTooltip.Positioner>['align'];
  alignOffset?: number;
  /** Show a small arrow pointing at the trigger. */
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
}

function TooltipContent({
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  arrow = false,
  className,
  children,
  ...props
}: TooltipContentProps) {
  const { id } = useTooltipContext('Content');
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        className={styles.positioner}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
      >
        <BaseTooltip.Popup id={id} role="tooltip" className={cx(styles.popup, className)} {...props}>
          {arrow && <BaseTooltip.Arrow className={styles.arrow} />}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

export type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;

/**
 * Optional. Shares the hover delay across tooltips inside it: once one tooltip is shown,
 * neighbours open instantly (e.g. a toolbar). Wrap a toolbar or the whole app.
 */
export function TooltipProvider(props: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props} />;
}

/**
 * A short hint shown on hover or keyboard focus, built on Base UI.
 * Tooltips are supplementary — don't put essential information or interactive content in them.
 *
 * ```tsx
 * import { SettingsIcon } from 'thira-icons/react/settings';
 *
 * <Tooltip>
 *   <Tooltip.Trigger render={<Button variant="ghost" aria-label="Settings" />}>
 *     <SettingsIcon size={16} />
 *   </Tooltip.Trigger>
 *   <Tooltip.Content>Settings</Tooltip.Content>
 * </Tooltip>
 * ```
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
