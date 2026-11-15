import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { ComponentProps, ReactElement } from 'react';
import { cx } from '../../utils/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction, but stays focusable so screen readers announce it. */
  loading?: boolean;
  className?: string;
  /**
   * Render a different element with button styles, e.g. a link:
   * `<Button render={<a href="/docs" />}>Docs</Button>`
   * The element keeps its own semantics (a link stays a link).
   */
  render?: ReactElement;
}

export function Button({ variant = 'solid', size = 'md', loading = false, className, children, render, ...props }: ButtonProps) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </>
  );

  if (render) {
    return (
      <StyledElement render={render} className={classes} {...props}>
        {content}
      </StyledElement>
    );
  }

  const { type, disabled, ...rest } = props;
  return (
    <BaseButton
      type={type ?? 'button'}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={classes}
      {...rest}
    >
      {content}
    </BaseButton>
  );
}

/** Applies button styling to an arbitrary element without changing its role. */
function StyledElement({ render, ...props }: ComponentProps<'button'> & { render: ReactElement }) {
  // Drop button-only attributes that make no sense on other elements.
  const { type: _type, disabled: _disabled, ...rest } = props;
  return useRender({ render, props: mergeProps<'button'>(rest, {}) });
}
