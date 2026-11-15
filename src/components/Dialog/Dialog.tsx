import * as RadixDialog from '@radix-ui/react-dialog';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Dialog.module.css';

export interface DialogContentProps extends Omit<ComponentPropsWithoutRef<typeof RadixDialog.Content>, 'title'> {
  /** Required for accessibility — announced by screen readers. */
  title: ReactNode;
  description?: ReactNode;
  /** Hide the × close button in the corner. */
  hideClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const DialogContent = forwardRef<ElementRef<typeof RadixDialog.Content>, DialogContentProps>(
  function DialogContent({ title, description, hideClose = false, size = 'md', className, children, ...props }, ref) {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content
          ref={ref}
          className={cx(styles.content, styles[size], className)}
          // Without a description, opt out of aria-describedby so Radix doesn't warn.
          {...(description ? null : { 'aria-describedby': undefined })}
          {...props}
        >
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          {description ? (
            <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>
          ) : null}
          {children}
          {!hideClose && (
            <RadixDialog.Close className={styles.close} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    );
  },
);

function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

/**
 * Accessible modal dialog (focus trap, Esc to close, scroll lock) built on Radix.
 *
 * ```tsx
 * <Dialog>
 *   <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
 *   <Dialog.Content title="Delete project?">
 *     <Dialog.Footer>
 *       <Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
export const Dialog = Object.assign(
  function Dialog(props: ComponentPropsWithoutRef<typeof RadixDialog.Root>) {
    return <RadixDialog.Root {...props} />;
  },
  {
    Trigger: RadixDialog.Trigger,
    Content: DialogContent,
    Footer: DialogFooter,
    Close: RadixDialog.Close,
  },
);
