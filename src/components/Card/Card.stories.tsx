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
        <Card.Title>Nine Swords</Card.Title>
        <Card.Description>Pixel isometric wuxia MMORPG</Card.Description>
      </Card.Header>
      <Card.Body>
        A browser-based MMORPG built with TypeScript. Explore an ink-wash world, master nine sword styles, and duel
        other players in real time.
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Details
        </Button>
        <Button size="sm">Play now</Button>
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
        <Card.Title>Modern CSS Unlocked</Card.Title>
        <Card.Description>5 features transforming web UI</Card.Description>
      </Card.Header>
      <Card.Body>Less JavaScript, less SCSS — and what to use instead.</Card.Body>
    </Card>
  ),
  args: { variant: 'elevated' },
};
