import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from './Checkbox';

describe('Checkbox', () => {
  it('has no axe violations', async () => {
    render(
      <CheckboxGroup label="Toppings" defaultValue={['cheese']}>
        <Checkbox value="cheese" label="Cheese" description="Extra mozzarella." />
        <Checkbox value="olives" label="Olives" />
        <Checkbox value="onions" label="Onions" disabled />
      </CheckboxGroup>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });

  it('renders a checkbox linked to its label', () => {
    render(<Checkbox label="I agree to the terms" />);
    const checkbox = screen.getByRole('checkbox', { name: 'I agree to the terms' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByLabelText('I agree to the terms')).toBe(checkbox);
  });

  it('toggles on click, including clicks on the label', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="I agree to the terms" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    await userEvent.click(screen.getByText('I agree to the terms'));
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with the Space key', async () => {
    render(<Checkbox label="I agree to the terms" />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return <Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('reports the indeterminate state as aria-checked="mixed"', () => {
    render(<Checkbox label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('describes the checkbox with its description', () => {
    render(<Checkbox label="Email notifications" description="A weekly summary." />);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('A weekly summary.');
  });

  it('ignores interaction when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="I agree to the terms" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('respects a custom id', () => {
    render(<Checkbox label="I agree to the terms" id="terms" />);
    expect(screen.getByLabelText('I agree to the terms')).toHaveAttribute('id', 'terms');
  });
});

describe('CheckboxGroup', () => {
  it('labels the group and shares its value', async () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup label="Toppings" defaultValue={['cheese']} onValueChange={onValueChange}>
        <Checkbox value="cheese" label="Cheese" />
        <Checkbox value="olives" label="Olives" />
      </CheckboxGroup>,
    );
    expect(screen.getByRole('group', { name: 'Toppings' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Cheese' })).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(screen.getByRole('checkbox', { name: 'Olives' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['cheese', 'olives'], expect.anything());
  });
});
