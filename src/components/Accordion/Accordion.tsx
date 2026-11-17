import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { createElement, type ComponentProps, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Accordion.module.css';

export type AccordionVariant = 'outline' | 'plain';

export interface AccordionProps extends Omit<ComponentProps<typeof BaseAccordion.Root>, 'className'> {
  /** `outline` draws a bordered box; `plain` keeps only the lines between items. */
  variant?: AccordionVariant;
  className?: string;
}

export interface AccordionItemProps extends Omit<ComponentProps<typeof BaseAccordion.Item>, 'className' | 'title'> {
  /** Text of the trigger button. */
  title: ReactNode;
  /** Heading level that wraps the trigger. Match your page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

function AccordionRoot({ variant = 'outline', className, ...props }: AccordionProps) {
  return <BaseAccordion.Root className={cx(styles.root, styles[variant], className)} {...props} />;
}

function AccordionItem({ title, headingLevel = 3, className, children, ...props }: AccordionItemProps) {
  return (
    <BaseAccordion.Item className={cx(styles.item, className)} {...props}>
      <BaseAccordion.Header className={styles.header} render={createElement(`h${String(headingLevel)}`)}>
        <BaseAccordion.Trigger className={styles.trigger}>
          <span className={styles.title}>{title}</span>
          <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel className={styles.panel}>
        <div className={styles.content}>{children}</div>
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}

/**
 * Collapsible sections with headings (FAQ, settings groups), built on Base UI.
 * One item open at a time by default; pass `multiple` to allow several.
 *
 * ```tsx
 * <Accordion defaultValue={['billing']}>
 *   <Accordion.Item value="billing" title="How does billing work?">…</Accordion.Item>
 *   <Accordion.Item value="cancel" title="Can I cancel any time?">…</Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionRoot, { Item: AccordionItem });
