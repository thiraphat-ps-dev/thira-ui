import { render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { Card } from './Card';

describe('Card', () => {
  it('renders all parts with their content', () => {
    render(
      <Card role="article" aria-label="Team plan">
        <Card.Header>
          <Card.Title>Team plan</Card.Title>
          <Card.Description>For growing teams.</Card.Description>
        </Card.Header>
        <Card.Body>Up to 10 members.</Card.Body>
        <Card.Footer>Billed monthly.</Card.Footer>
      </Card>,
    );
    const card = screen.getByRole('article', { name: 'Team plan' });
    expect(within(card).getByRole('heading', { name: 'Team plan' })).toBeInTheDocument();
    expect(within(card).getByText('For growing teams.')).toBeInTheDocument();
    expect(within(card).getByText('Up to 10 members.')).toBeInTheDocument();
    expect(within(card).getByText('Billed monthly.')).toBeInTheDocument();
  });

  it('renders the title as a level-3 heading', () => {
    render(<Card.Title>Alex Morgan</Card.Title>);
    const heading = screen.getByRole('heading', { level: 3, name: 'Alex Morgan' });
    expect(heading.tagName).toBe('H3');
  });

  it('renders the description as a paragraph and the other parts as divs', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Description>Description</Card.Description>
        <Card.Body>Body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Description').tagName).toBe('P');
    expect(screen.getByText('Header').tagName).toBe('DIV');
    expect(screen.getByText('Body').tagName).toBe('DIV');
    expect(screen.getByText('Footer').tagName).toBe('DIV');
  });

  it('uses the outline variant by default and is not interactive', () => {
    render(<Card>Team plan</Card>);
    const card = screen.getByText('Team plan');
    expect(card).toHaveClass('card', 'outline');
    expect(card).not.toHaveClass('elevated', 'interactive');
  });

  it('applies the elevated variant and interactive classes', () => {
    render(
      <Card variant="elevated" interactive>
        Team plan
      </Card>,
    );
    const card = screen.getByText('Team plan');
    expect(card).toHaveClass('card', 'elevated', 'interactive');
    expect(card).not.toHaveClass('outline');
  });

  it('merges a custom className on every part', () => {
    render(
      <Card role="article" aria-label="Team plan" className="custom-root">
        <Card.Header className="custom-header">Header</Card.Header>
        <Card.Title className="custom-title">Title</Card.Title>
        <Card.Description className="custom-description">Description</Card.Description>
        <Card.Body className="custom-body">Body</Card.Body>
        <Card.Footer className="custom-footer">Footer</Card.Footer>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toHaveClass('title', 'custom-title');
    expect(screen.getByText('Header')).toHaveClass('header', 'custom-header');
    expect(screen.getByText('Description')).toHaveClass('description', 'custom-description');
    expect(screen.getByText('Body')).toHaveClass('body', 'custom-body');
    expect(screen.getByText('Footer')).toHaveClass('footer', 'custom-footer');
    expect(screen.getByRole('article')).toHaveClass('card', 'outline', 'custom-root');
  });

  it('passes native props through to the element', () => {
    render(
      <Card role="region" aria-label="Profile" id="profile-card">
        <Card.Body>Alex Morgan</Card.Body>
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Profile' })).toHaveAttribute('id', 'profile-card');
  });

  it('accepts ref as a prop on every part (React 19)', () => {
    const rootRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const bodyRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();
    render(
      <Card ref={rootRef}>
        <Card.Header ref={headerRef}>
          <Card.Title ref={titleRef}>Team plan</Card.Title>
          <Card.Description ref={descriptionRef}>For growing teams.</Card.Description>
        </Card.Header>
        <Card.Body ref={bodyRef}>Up to 10 members.</Card.Body>
        <Card.Footer ref={footerRef}>Billed monthly.</Card.Footer>
      </Card>,
    );
    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
    expect(descriptionRef.current).toBeInstanceOf(HTMLParagraphElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement);
    expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
