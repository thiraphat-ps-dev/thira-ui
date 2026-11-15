import { Toast } from '@base-ui/react/toast';
import { useMemo, type ReactNode } from 'react';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss; `0` keeps it open. Defaults to the provider's duration. */
  duration?: number;
  /** Optional action button, e.g. "Undo". */
  action?: { label: string; onClick: () => void };
  /** `high` announces urgently to screen readers — use for errors. */
  priority?: 'low' | 'high';
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss time in ms. */
  duration?: number;
  /** Max toasts on screen at once; older ones animate out. */
  limit?: number;
}

/** Wrap your app once, then call `useToast().toast({...})` anywhere below it. */
export function ToastProvider({ children, duration = 5000, limit = 3 }: ToastProviderProps) {
  return (
    <Toast.Provider timeout={duration} limit={limit}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport}>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className={styles.toast} data-tone={toast.type ?? 'neutral'}>
      <Toast.Content className={styles.content}>
        <div className={styles.text}>
          <Toast.Title className={styles.title} />
          <Toast.Description className={styles.description} />
        </div>
        <Toast.Action className={styles.action} />
        <Toast.Close className={styles.close} aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

export interface UseToastReturn {
  /** Show a toast; returns its id. */
  toast: (options: ToastOptions) => string;
  /** Close a toast by id. */
  dismiss: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const manager = Toast.useToastManager();
  return useMemo(
    () => ({
      toast: ({ title, description, tone = 'neutral', duration, action, priority }) =>
        manager.add({
          title,
          description,
          type: tone,
          timeout: duration,
          priority: priority ?? (tone === 'danger' ? 'high' : 'low'),
          actionProps: action ? { children: action.label, onClick: action.onClick } : undefined,
        }),
      dismiss: (id) => {
        manager.close(id);
      },
    }),
    [manager],
  );
}
