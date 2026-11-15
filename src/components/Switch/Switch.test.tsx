import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch linked to its label', () => {
    render(<Switch label="Email notifications" />);
    const toggle = screen.getByRole('switch', { name: 'Email notifications' });
    expect(toggle).toBe(screen.getByLabelText('Email notifications'));
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('describes the switch with its description', () => {
    render(<Switch label="Email notifications" description="Get a weekly summary." />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Get a weekly summary.');
  });

  it('toggles on click', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Email notifications" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles when the label is clicked', async () => {
    render(<Switch label="Email notifications" />);
    await userEvent.click(screen.getByText('Email notifications'));
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles with the Space key', async () => {
    render(<Switch label="Email notifications" defaultChecked />);
    const toggle = screen.getByRole('switch');
    await userEvent.tab();
    expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('supports controlled use', async () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return (
        <>
          <Switch label="Dark mode" checked={on} onCheckedChange={setOn} />
          <output>{on ? 'on' : 'off'}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('status')).toHaveTextContent('on');
  });

  it('ignores interaction when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Email notifications" disabled onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('accepts aria-label when there is no visible label', () => {
    render(<Switch aria-label="Wi-Fi" />);
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
  });
});
