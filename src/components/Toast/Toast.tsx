import * as RadixToast from '@radix-ui/react-toast';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Toast.module.css';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. Defaults to the provider's duration. */
  duration?: number;
  /** Optional action button, e.g. "Undo". `altText` describes it for screen readers. */
  action?: { label: string; altText: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
  open: boolean;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss time in ms. */
  duration?: number;
  /** Max toasts on screen at once; oldest are dropped. */
  limit?: number;
}

/** Wrap your app once, then call `useToast().toast({...})` anywhere below it. */
export function ToastProvider({ children, duration = 5000, limit = 3 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, open: false } : t)));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = ++nextId.current;
      setItems((list) => [...list, { ...options, id, open: true }].slice(-limit));
      return id;
    },
    [limit],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider duration={duration} swipeDirection="right">
        {children}
        {items.map((item) => (
          <RadixToast.Root
            key={item.id}
            open={item.open}
            duration={item.duration}
            onOpenChange={(open) => {
              if (!open) dismiss(item.id);
            }}
            onAnimationEnd={() => {
              if (!item.open) remove(item.id);
            }}
            className={cx(styles.toast, styles[item.tone ?? 'neutral'])}
          >
            <div className={styles.text}>
              <RadixToast.Title className={styles.title}>{item.title}</RadixToast.Title>
              {item.description ? (
                <RadixToast.Description className={styles.description}>{item.description}</RadixToast.Description>
              ) : null}
            </div>
            {item.action ? (
              <RadixToast.Action altText={item.action.altText} asChild>
                <button type="button" className={styles.action} onClick={item.action.onClick}>
                  {item.action.label}
                </button>
              </RadixToast.Action>
            ) : null}
            <RadixToast.Close className={styles.close} aria-label="Dismiss">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>.');
  return ctx;
}
