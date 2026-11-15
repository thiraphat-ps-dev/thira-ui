import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated'] },
  },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <Card.Header>
        <Card.Title>Team plan</Card.Title>
        <Card.Description>For growing teams</Card.Description>
      </Card.Header>
      <Card.Body>
        Unlimited projects, shared workspaces and priority support. Invite up to 20 members and manage roles from one
        place.
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Details
        </Button>
        <Button size="sm">Upgrade</Button>
      </Card.Footer>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {};

export const Elevated: Story = {
  args: { variant: 'elevated' },
};

/** Hover lift for cards that act as one big link. */
export const Interactive: Story = {
  render: (args) => (
    <Card {...args} interactive tabIndex={0} style={{ width: 300 }}>
      <Card.Header>
        <Card.Title>Getting started</Card.Title>
        <Card.Description>Set up your first project in 5 minutes</Card.Description>
      </Card.Header>
      <Card.Body>Install the package, import the styles and render your first component.</Card.Body>
    </Card>
  ),
  args: { variant: 'elevated' },
};
