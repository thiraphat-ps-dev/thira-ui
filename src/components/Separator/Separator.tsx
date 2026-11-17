import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Separator.module.css';

export interface SeparatorProps extends Omit<ComponentProps<typeof BaseSeparator>, 'className'> {
  /**
   * Purely visual line, hidden from assistive tech. Use it when the line only decorates
   * (e.g. between links in a row); leave it off when it separates sections of content.
   */
  decorative?: boolean;
  className?: string;
}

/**
 * A thin line between sections: `<Separator />` or `<Separator orientation="vertical" />`.
 * Exposes `role="separator"` unless `decorative`. A vertical separator stretches to its
 * flex row, so give the parent `display: flex`.
 */
export function Separator({ decorative = false, orientation = 'horizontal', className, ...props }: SeparatorProps) {
  const classes = cx(styles.separator, className);
  if (decorative) {
    return <div aria-hidden="true" data-orientation={orientation} className={classes} />;
  }
  return <BaseSeparator orientation={orientation} className={classes} {...props} />;
}
