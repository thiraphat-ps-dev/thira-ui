import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Radio, RadioGroup, type RadioGroupProps } from './Radio';

function Plans(props: Partial<RadioGroupProps>) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="starter" label="Starter" />
      <Radio value="team" label="Team" description="Up to 10 members." />
      <Radio value="enterprise" label="Enterprise" />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders a radiogroup named by its visible label', () => {
    render(<Plans />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('links each radio to its label and description', () => {
    render(<Plans />);
    const team = screen.getByRole('radio', { name: 'Team' });
    expect(screen.getByLabelText('Team')).toBe(team);
    expect(team).toHaveAccessibleDescription('Up to 10 members.');
    expect(screen.getByRole('radio', { name: 'Starter' })).not.toHaveAttribute('aria-describedby');
  });

  it('describes the group with its hint', () => {
    render(<Plans hint="You can change this later." />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleDescription('You can change this later.');
    expect(group).not.toHaveAttribute('aria-invalid');
  });

  it('marks the group invalid and shows the error instead of the hint', () => {
    render(<Plans hint="You can change this later." error="Choose a plan." />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Choose a plan.');
    expect(screen.queryByText('You can change this later.')).not.toBeInTheDocument();
  });

  it('marks the group required', () => {
    render(<Plans required />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute('aria-required', 'true');
  });

  it('selects on click, including clicks on the label (uncontrolled)', async () => {
    const onValueChange = vi.fn();
    render(<Plans defaultValue="starter" onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: 'Starter' })).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(screen.getByText('Team'));
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Starter' })).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith('team', expect.anything());
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState('team');
      return (
        <>
          <Plans value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(screen.getByRole('radio', { name: 'Enterprise' }));
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('enterprise');
  });

  it('moves and selects with arrow keys; Tab enters and leaves the group', async () => {
    render(
      <>
        <button type="button">Before</button>
        <Plans defaultValue="team" />
        <button type="button">After</button>
      </>,
    );
    const [starter, team, enterprise] = screen.getAllByRole('radio');

    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.tab();
    expect(team).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(enterprise).toHaveFocus();
    expect(enterprise).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(starter).toHaveFocus();
    expect(starter).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{ArrowRight}');
    expect(team).toHaveFocus();
    expect(team).toHaveAttribute('aria-checked', 'true');

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(team).toHaveFocus();
  });

  it('skips and ignores a disabled radio', async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup label="Plan" defaultValue="starter" onValueChange={onValueChange}>
        <Radio value="starter" label="Starter" />
        <Radio value="team" label="Team" disabled />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>,
    );
    const team = screen.getByRole('radio', { name: 'Team' });
    expect(team).toBeDisabled();
    await userEvent.click(team);
    expect(team).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Starter' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const enterprise = screen.getByRole('radio', { name: 'Enterprise' });
    expect(enterprise).toHaveFocus();
    expect(enterprise).toHaveAttribute('aria-checked', 'true');
  });

  it('disables every radio when the group is disabled', async () => {
    const onValueChange = vi.fn();
    render(<Plans disabled defaultValue="starter" onValueChange={onValueChange} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
    await userEvent.click(screen.getByText('Team'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('submits the selected value under its name', async () => {
    render(
      <form aria-label="Signup">
        <Plans name="plan" defaultValue="team" />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>('form');
    expect(new FormData(form).get('plan')).toBe('team');
    await userEvent.click(screen.getByRole('radio', { name: 'Starter' }));
    expect(new FormData(form).get('plan')).toBe('starter');
  });

  it('accepts aria-label when there is no visible label', () => {
    render(
      <RadioGroup aria-label="Billing period">
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Yearly" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Billing period' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    render(<Plans defaultValue="team" hint="You can change this later." required />);
    await expect(document.body).toHaveNoAxeViolations();
  });

  it('has no axe violations with an error, a row layout and a disabled item', async () => {
    render(
      <RadioGroup label="Plan" error="Choose a plan." orientation="horizontal">
        <Radio value="starter" label="Starter" />
        <Radio value="team" label="Team" disabled />
      </RadioGroup>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
