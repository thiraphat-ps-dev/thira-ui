import { render, screen } from '@testing-library/react';
import { Avatar, getInitials } from './Avatar';

describe('getInitials', () => {
  it('takes the first letter of the first and last word', () => {
    expect(getInitials('Alex Morgan')).toBe('AM');
    expect(getInitials('  Jamie Lee Chen ')).toBe('JC');
    expect(getInitials('sam')).toBe('S');
    expect(getInitials('')).toBe('');
  });

  it('skips Thai leading vowels', () => {
    expect(getInitials('สมชาย ใจดี')).toBe('สจ');
    expect(getInitials('เอก')).toBe('อ');
  });
});

describe('Avatar', () => {
  it('is an image named by `name`, showing initials without a src', () => {
    render(<Avatar name="Alex Morgan" />);
    const avatar = screen.getByRole('img', { name: 'Alex Morgan' });
    expect(avatar).toHaveTextContent('AM');
  });

  it('shows a custom fallback', () => {
    render(<Avatar name="3 more members" fallback="+3" />);
    expect(screen.getByRole('img', { name: '3 more members' })).toHaveTextContent('+3');
  });

  it('is decorative without a name', () => {
    const { container } = render(<Avatar fallback="?" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('groups avatars under one label', async () => {
    const { container } = render(
      <Avatar.Group aria-label="Project members">
        <Avatar name="Alex Morgan" />
        <Avatar name="Jamie Chen" />
        <Avatar name="2 more members" fallback="+2" />
      </Avatar.Group>,
    );
    const group = screen.getByRole('group', { name: 'Project members' });
    expect(group.children).toHaveLength(3);
    await expect(container).toHaveNoAxeViolations();
  });
});
