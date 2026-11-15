import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `elevated` adds a shadow; `outline` uses a border only. */
  variant?: 'outline' | 'elevated';
  /** Adds hover lift — use when the whole card is clickable. */
  interactive?: boolean;
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outline', interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.card, styles[variant], interactive && styles.interactive, className)}
      {...props}
    />
  );
});

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.header, className)} {...props} />;
});

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function CardTitle(
  { className, ...props },
  ref,
) {
  return <h3 ref={ref} className={cx(styles.title, className)} {...props} />;
});

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx(styles.description, className)} {...props} />;
  },
);

const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.body, className)} {...props} />;
});

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.footer, className)} {...props} />;
});

/** Compound card: `<Card><Card.Header><Card.Title/></Card.Header><Card.Body/><Card.Footer/></Card>` */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});
