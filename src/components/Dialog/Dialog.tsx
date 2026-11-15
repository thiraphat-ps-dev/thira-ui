import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Dialog.module.css';

export interface DialogContentProps extends Omit<ComponentProps<typeof BaseDialog.Popup>, 'className' | 'title'> {
  /** Required for accessibility — announced by screen readers. */
  title: ReactNode;
  description?: ReactNode;
  /** Hide the × close button in the corner. */
  hideClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function DialogContent({
  title,
  description,
  hideClose = false,
  size = 'md',
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={styles.backdrop} />
      <BaseDialog.Popup className={cx(styles.popup, styles[size], className)} {...props}>
        <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>
        {description ? (
          <BaseDialog.Description className={styles.description}>{description}</BaseDialog.Description>
        ) : null}
        {children}
        {!hideClose && (
          <BaseDialog.Close className={styles.close} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

/**
 * Accessible modal dialog (focus trap, Esc to close, scroll lock) built on Base UI.
 *
 * ```tsx
 * <Dialog>
 *   <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
 *   <Dialog.Content title="Delete project?">
 *     <Dialog.Footer>
 *       <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
export const Dialog = Object.assign(
  function Dialog(props: ComponentProps<typeof BaseDialog.Root>) {
    return <BaseDialog.Root {...props} />;
  },
  {
    Trigger: BaseDialog.Trigger,
    Content: DialogContent,
    Footer: DialogFooter,
    Close: BaseDialog.Close,
  },
);
