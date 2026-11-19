import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tabs, type TabsProps } from './Tabs';

function Example(props: Omit<TabsProps, 'children'> & { disableActivity?: boolean }) {
  const { disableActivity, ...rest } = props;
  return (
    <Tabs {...rest}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity" disabled={disableActivity}>
          Activity
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="activity">Activity content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('has no axe violations', async () => {
    render(<Example defaultValue="overview" disableActivity />);
    await expect(document.body).toHaveNoAxeViolations();
  });

  it('wires up tablist, tab and tabpanel roles', () => {
    render(<Example defaultValue="overview" />);
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);

    const tab = screen.getByRole('tab', { name: 'Overview' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveTextContent('Overview content');
    expect(panel).toHaveAccessibleName('Overview');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
  });

  it('selects a tab on click (uncontrolled)', async () => {
    render(<Example defaultValue="overview" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings content');
  });

  it('moves focus with arrow keys and activates with Enter', async () => {
    render(<Example defaultValue="overview" />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus(); // wraps around
  });

  it('uses up/down arrows when vertical', async () => {
    render(<Example defaultValue="overview" orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('does not activate a disabled tab', async () => {
    render(<Example defaultValue="overview" disableActivity />);
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveAttribute('aria-disabled', 'true');

    // Base UI keeps disabled tabs focusable (discoverable by screen readers) but not selectable
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(activity).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(activity).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(activity);
    expect(activity).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview content');
  });

  it('works as a controlled component', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('overview');
      return (
        <Example
          value={value}
          onValueChange={(next: string) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onChange).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity content');
  });
});
