import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from '../Dialog/Dialog.module.css';

export interface AlertDialogContentProps extends Omit<
  ComponentProps<typeof BaseAlertDialog.Popup>,
  'className' | 'title'
> {
  /** The question being asked, e.g. "Delete this project?". */
  title: ReactNode;
  /** The consequence, e.g. "This cannot be undone." Announced together with the title. */
  description: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function AlertDialogContent({
  title,
  description,
  size = 'sm',
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={styles.backdrop} />
      <BaseAlertDialog.Popup className={cx(styles.popup, styles[size], className)} {...props}>
        <BaseAlertDialog.Title className={styles.title}>{title}</BaseAlertDialog.Title>
        <BaseAlertDialog.Description className={styles.description}>{description}</BaseAlertDialog.Description>
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  );
}

function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

/**
 * A confirmation that needs an answer (`role="alertdialog"`). Unlike `Dialog` it has no ×
 * button and doesn't close on an outside click — the user picks one of your actions, or
 * presses Esc to cancel.
 *
 * ```tsx
 * <AlertDialog>
 *   <AlertDialog.Trigger render={<Button variant="danger" />}>Delete</AlertDialog.Trigger>
 *   <AlertDialog.Content title="Delete this project?" description="This cannot be undone.">
 *     <AlertDialog.Footer>
 *       <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
 *       <AlertDialog.Close render={<Button variant="danger" />} onClick={remove}>Delete</AlertDialog.Close>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog>
 * ```
 */
export const AlertDialog = Object.assign(
  function AlertDialog(props: ComponentProps<typeof BaseAlertDialog.Root>) {
    return <BaseAlertDialog.Root {...props} />;
  },
  {
    Trigger: BaseAlertDialog.Trigger,
    Content: AlertDialogContent,
    Footer: AlertDialogFooter,
    Close: BaseAlertDialog.Close,
  },
);
