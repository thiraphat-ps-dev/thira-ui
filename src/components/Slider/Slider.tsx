import { Slider as BaseSlider } from '@base-ui/react/slider';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Field } from '../Field/Field';
import styles from './Slider.module.css';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps extends Omit<
  ComponentProps<typeof BaseSlider.Root>,
  'className' | 'render' | 'children' | 'orientation'
> {
  /** Visible label for the slider group (and the thumb, when there is one). Without it, pass `aria-label`. */
  label?: ReactNode;
  /** Helper text shown below the slider. */
  hint?: ReactNode;
  /** Error message — marks the slider invalid and replaces the hint. */
  error?: ReactNode;
  /** Show the formatted value (e.g. "40" or "20 – 80") next to the label. Not announced live while dragging. */
  showValue?: boolean;
  /** Thumb and track size. */
  size?: SliderSize;
  /**
   * Accessible names for the thumbs of a range slider, in order. The label names the group;
   * these tell the thumbs apart. Default `['Minimum', 'Maximum']`.
   */
  thumbLabels?: readonly string[];
  /** Accessible name for a single-thumb slider without a visible `label`. */
  'aria-label'?: string;
  /** Text read for a thumb's value, e.g. `(formatted) => \`${formatted} items\``. */
  getAriaValueText?: ComponentProps<typeof BaseSlider.Thumb>['getAriaValueText'];
  className?: string;
}

const DEFAULT_THUMB_LABELS = ['Minimum', 'Maximum'];

/**
 * Pick a number, or a range with two thumbs, by dragging or with the arrow keys
 * (Shift/Page Up/Page Down for bigger steps, Home/End for the ends). Built on Base UI's `Slider`
 * inside a `Field`, so it takes `label`, `hint` and `error` like `Input`.
 *
 * ```tsx
 * <Slider label="Volume" defaultValue={40} showValue />
 * <Slider label="Price" defaultValue={[20, 80]} format={{ style: 'currency', currency: 'USD' }} />
 * ```
 */
export function Slider({
  label,
  hint,
  error,
  showValue = false,
  size = 'md',
  thumbLabels = DEFAULT_THUMB_LABELS,
  'aria-label': ariaLabel,
  getAriaValueText,
  className,
  disabled,
  ...props
}: SliderProps) {
  const messageId = `${useId()}-message`;
  const initial = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(initial) ? initial.length : 1;
  const range = thumbCount > 1;

  return (
    <Field
      hint={hint}
      error={error}
      invalid={Boolean(error)}
      disabled={disabled}
      nativeLabel={false}
      messageId={messageId}
      className={cx(styles.field, styles[size], className)}
    >
      <BaseSlider.Root className={styles.root} disabled={disabled} {...props}>
        {(Boolean(label) || showValue) && (
          <div className={styles.header}>
            {label && (
              <Field.Label nativeLabel={false} render={<div />}>
                {label}
              </Field.Label>
            )}
            {showValue && <BaseSlider.Value className={styles.value} />}
          </div>
        )}
        <BaseSlider.Control className={styles.control}>
          <BaseSlider.Track className={styles.track}>
            <BaseSlider.Indicator className={styles.indicator} />
            {Array.from({ length: thumbCount }, (_, index) => (
              <BaseSlider.Thumb
                key={index}
                index={index}
                className={styles.thumb}
                aria-label={range ? thumbLabels[index] : ariaLabel}
                getAriaValueText={getAriaValueText}
              />
            ))}
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
    </Field>
  );
}
