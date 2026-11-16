import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Kbd.module.css';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends ComponentProps<'kbd'> {
  size?: KbdSize;
}

/**
 * A key on the keyboard, as a native `<kbd>`: `<Kbd>Esc</Kbd>`. For a shortcut, write each key
 * and the joiner as text, so screen readers read it naturally: `<Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>`.
 * For symbol keys, add a `title` or visually hidden text (`<Kbd title="Command">⌘</Kbd>`).
 */
export function Kbd({ size = 'md', className, ...props }: KbdProps) {
  return <kbd className={cx(styles.kbd, styles[size], className)} {...props} />;
}
