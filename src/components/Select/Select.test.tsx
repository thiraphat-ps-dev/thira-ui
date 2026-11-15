import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Select, type SelectProps } from './Select';

function Plans(props: Partial<SelectProps>) {
  return (
    <Select label="Plan" placeholder="Choose a plan" {...props}>
      <Select.Item value="free">Free</Select.Item>
      <Select.Item value="team">Team</Select.Item>
      <Select.Item value="enterprise">Enterprise</Select.Item>
    </Select>
  );
}

describe('Select', () => {
  it('links the label to the combobox trigger', () => {
    render(<Plans />);
    expect(screen.getByRole('combobox', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByLabelText('Plan')).toHaveAttribute('role', 'combobox');
  });

  it('shows the placeholder, then the selected label (not the raw value)', () => {
    const { unmount } = render(<Plans />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Choose a plan');
    unmount();

    render(<Plans defaultValue="team" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Team');
  });

  it('opens a listbox and selects an option with the mouse', async () => {
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Plan' }));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);

    await userEvent.click(screen.getByRole('option', { name: 'Enterprise' }));
    expect(onValueChange).toHaveBeenCalledWith('enterprise', expect.anything());
    expect(screen.getByRole('combobox')).toHaveTextContent('Enterprise');
  });

  it('selects with the keyboard', async () => {
    render(<Plans defaultValue="free" />);
    const trigger = screen.getByRole('combobox', { name: 'Plan' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(trigger).toHaveTextContent('Team');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the selected option', async () => {
    render(<Plans defaultValue="team" />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Team' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Free' })).toHaveAttribute('aria-selected', 'false');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>('free');
      return (
        <>
          <Plans value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Team' }));
    expect(screen.getByRole('status')).toHaveTextContent('team');
    expect(screen.getByRole('combobox')).toHaveTextContent('Team');
  });

  it('renders options from the items prop', async () => {
    render(
      <Select
        label="Plan"
        defaultValue="free"
        items={[
          { value: 'free', label: 'Free' },
          { value: 'team', label: 'Team', disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Free');
    await userEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('option', { name: 'Team' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not open when disabled', async () => {
    render(<Plans disabled />);
    const trigger = screen.getByRole('combobox', { name: 'Plan' });
    await userEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('data-disabled');
  });

  it('describes the trigger with its hint, or the error instead', () => {
    const { rerender } = render(<Plans hint="You can change it later." />);
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('You can change it later.');

    rerender(<Plans hint="You can change it later." error="Choose a plan" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Choose a plan');
  });

  it('labels group options', async () => {
    render(
      <Select label="Assignee" defaultValue="alex">
        <Select.Group>
          <Select.GroupLabel>Design</Select.GroupLabel>
          <Select.Item value="alex">Alex Morgan</Select.Item>
        </Select.Group>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Alex Morgan');
    await userEvent.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('group', { name: 'Design' })).toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<Plans defaultValue="team" hint="You can change it later." />);
    await userEvent.click(screen.getByRole('combobox'));
    const listbox = await screen.findByRole('listbox');
    const portal = listbox.closest('[data-base-ui-portal]');
    if (!portal) throw new Error('popup is not portaled');
    // Check the field and the portaled popup separately: axe's page-level `region` (landmarks) rule
    // would flag the bare test page, and Storybook's axe disables it for the same reason.
    await expect(container).toHaveNoAxeViolations();
    await expect(portal).toHaveNoAxeViolations();
  });
});
