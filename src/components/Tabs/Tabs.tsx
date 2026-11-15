import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import styles from './Tabs.module.css';

export interface TabsProps extends Omit<ComponentProps<typeof BaseTabs.Root>, 'className'> {
  className?: string;
}

export interface TabsListProps extends Omit<ComponentProps<typeof BaseTabs.List>, 'className'> {
  className?: string;
}

export interface TabsTabProps extends Omit<ComponentProps<typeof BaseTabs.Tab>, 'className'> {
  className?: string;
}

export interface TabsPanelProps extends Omit<ComponentProps<typeof BaseTabs.Panel>, 'className'> {
  className?: string;
}

function TabsRoot({ className, ...props }: TabsProps) {
  return <BaseTabs.Root className={cx(styles.root, className)} {...props} />;
}

/** Tab strip. Renders the animated active-tab indicator for you. */
function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <BaseTabs.List className={cx(styles.list, className)} {...props}>
      {children}
      <BaseTabs.Indicator className={styles.indicator} />
    </BaseTabs.List>
  );
}

function TabsTab({ className, ...props }: TabsTabProps) {
  return <BaseTabs.Tab className={cx(styles.tab, className)} {...props} />;
}

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel className={cx(styles.panel, className)} {...props} />;
}

/**
 * Accessible tabs (roving focus, arrow-key navigation, ARIA wiring) built on Base UI.
 *
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <Tabs.List aria-label="Project">
 *     <Tabs.Tab value="overview">Overview</Tabs.Tab>
 *     <Tabs.Tab value="activity">Activity</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="overview">…</Tabs.Panel>
 *   <Tabs.Panel value="activity">…</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
