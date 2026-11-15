import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Panels() {
  return (
    <>
      <Tabs.Panel value="overview">
        A summary of the project: open tasks, recent changes and who is involved.
      </Tabs.Panel>
      <Tabs.Panel value="activity">Latest updates, newest first.</Tabs.Panel>
      <Tabs.Panel value="settings">Name, visibility and notification preferences.</Tabs.Panel>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ maxWidth: 480 }}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="overview" orientation="vertical" style={{ maxWidth: 560 }}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ maxWidth: 480 }}>
      <Tabs.List aria-label="Project">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity" disabled>
          Activity
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Panels />
    </Tabs>
  ),
};

/** Control `value` yourself, e.g. to sync the active tab with the URL. */
export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState('activity');
    return (
      <div style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <Tabs
          value={value}
          onValueChange={(next: string) => {
            setValue(next);
          }}
        >
          <Tabs.List aria-label="Project">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Panels />
        </Tabs>
        <p style={{ margin: 0, fontSize: 14 }}>
          Active tab: <code>{value}</code>
        </p>
      </div>
    );
  },
};
