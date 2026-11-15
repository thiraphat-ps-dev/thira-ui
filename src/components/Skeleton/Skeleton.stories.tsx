import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
  },
  decorators: [
    (Story) => (
      // The loading region carries aria-busy; skeletons themselves are aria-hidden.
      <section aria-busy="true" aria-label="Loading example" style={{ width: 320 }}>
        <Story />
      </section>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rect: Story = {};

export const Text: Story = {
  args: { variant: 'text' },
};

export const Paragraph: Story = {
  args: { lines: 4 },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48 },
};

export const CustomSize: Story = {
  args: { width: 200, height: 120, radius: 24 },
};

/** A media row: avatar + two lines of text. */
export const MediaObject: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton variant="circle" />
      <div style={{ flex: 1, display: 'grid', gap: 8 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  ),
};

function PlanCard({ loading }: { loading: boolean }) {
  return (
    <Card aria-busy={loading} aria-label="Team plan" role="region" style={{ width: 360 }}>
      <Card.Header>
        {loading ? (
          <>
            <Skeleton variant="text" width="45%" height="1.25rem" />
            <Skeleton variant="text" width="30%" />
          </>
        ) : (
          <>
            <Card.Title>Team plan</Card.Title>
            <Card.Description>For growing teams</Card.Description>
          </>
        )}
      </Card.Header>
      <Card.Body>
        {loading ? (
          <Skeleton lines={3} />
        ) : (
          'Unlimited projects, shared workspaces and priority support. Invite up to 20 members and manage roles from one place.'
        )}
      </Card.Body>
      <Card.Footer>{loading ? <Skeleton width={84} height="2rem" /> : <Button size="sm">Upgrade</Button>}</Card.Footer>
    </Card>
  );
}

/**
 * Realistic loading state: the Card is the `aria-busy` region, and the skeletons mirror the final
 * layout so nothing jumps when content arrives. Toggles every 2.5 seconds.
 */
export const CardLoading: Story = {
  decorators: [(Story) => <Story />],
  render: function Render() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const id = setInterval(() => {
        setLoading((l) => !l);
      }, 2500);
      return () => {
        clearInterval(id);
      };
    }, []);
    return <PlanCard loading={loading} />;
  },
};

/** The same card held in its loading state, for visual review in both themes. */
export const CardLoadingStatic: Story = {
  decorators: [(Story) => <Story />],
  render: () => <PlanCard loading />,
};
