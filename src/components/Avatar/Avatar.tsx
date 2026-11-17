import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends Omit<ComponentProps<typeof BaseAvatar.Root>, 'className' | 'children'> {
  /** Image URL. The fallback shows while it loads or if it fails. */
  src?: string;
  /** Who the avatar shows. Becomes the accessible name and the source of the initials. Omit for a decorative avatar. */
  name?: string;
  /** Custom fallback content, e.g. an icon or "+3". Defaults to the initials of `name`. */
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

/** Thai leading vowels (เ แ โ ใ ไ) are written before the consonant, so skip them for initials. */
const LEADING_VOWEL = /^[เ-ไ]/u;

/** "Alex Morgan" → "AM", "Sam" → "S", "สมชาย ใจดี" → "สจ". */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean);
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words;
  return picked
    .map((word = '') => Array.from(word.replace(LEADING_VOWEL, '') || word)[0] ?? '')
    .join('')
    .toLocaleUpperCase();
}

/**
 * A user image with an initials fallback: `<Avatar src="/a.jpg" name="Alex Morgan" />`.
 *
 * With `name`, the avatar is a single `role="img"` named by it, whether the photo or the
 * initials are showing. Without `name` it is decorative (`aria-hidden`), for when the name is
 * already written next to it.
 */
function AvatarRoot({ src, name, fallback, size = 'md', shape = 'circle', className, ...props }: AvatarProps) {
  const a11y = name ? { role: 'img', 'aria-label': name } : { 'aria-hidden': true };
  return (
    <BaseAvatar.Root className={cx(styles.avatar, styles[size], styles[shape], className)} {...a11y} {...props}>
      {src ? <BaseAvatar.Image src={src} alt="" className={styles.image} /> : null}
      <BaseAvatar.Fallback className={styles.fallback}>
        {fallback ?? (name ? getInitials(name) : null)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export type AvatarGroupProps = ComponentProps<'div'>;

/**
 * Overlapping row of avatars, exposed as a `group` — give it an `aria-label` such as
 * "Project members". For overflow, end with `<Avatar fallback="+3" name="3 more members" />`.
 */
function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return <div role="group" className={cx(styles.group, className)} {...props} />;
}

export const Avatar = Object.assign(AvatarRoot, { Group: AvatarGroup });
