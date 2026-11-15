import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Card.module.css';

export interface CardProps extends ComponentProps<'div'> {
  /** `elevated` adds a shadow; `outline` uses a border only. */
  variant?: 'outline' | 'elevated';
  /** Adds hover lift — use when the whole card is clickable. */
  interactive?: boolean;
}

function CardRoot({ variant = 'outline', interactive = false, className, ...props }: CardProps) {
  return <div className={cx(styles.card, styles[variant], interactive && styles.interactive, className)} {...props} />;
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.header, className)} {...props} />;
}

function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cx(styles.title, className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cx(styles.description, className)} {...props} />;
}

function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.body, className)} {...props} />;
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

/** Compound card: `<Card><Card.Header><Card.Title/></Card.Header><Card.Body/><Card.Footer/></Card>` */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});
