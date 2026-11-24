import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';

describe('NumberField', () => {
  it('links the label to the input', () => {
    render(<NumberField label="Seats" defaultValue={5} />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    expect(input).toHaveValue('5');
    expect(input).toHaveAttribute('aria-roledescription', 'Number field');
    // `<label for>` already names it; no redundant aria-labelledby.
    expect(input).not.toHaveAttribute('aria-labelledby');
  });

  it('takes an aria-label when there is no visible label', () => {
    render(<NumberField aria-label="Quantity" />);
    expect(screen.getByRole('textbox', { name: 'Quantity' })).toBeInTheDocument();
  });

  it('steps with the buttons and clamps to min/max', async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Seats" defaultValue={2} min={1} max={3} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    const increase = screen.getByRole('button', { name: 'Increase' });
    const decrease = screen.getByRole('button', { name: 'Decrease' });

    await userEvent.click(increase);
    expect(input).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith(3, expect.anything());
    expect(increase).toBeDisabled();

    await userEvent.click(decrease);
    await userEvent.click(decrease);
    expect(input).toHaveValue('1');
    expect(decrease).toBeDisabled();
  });

  it('steps with the arrow keys by step', async () => {
    render(<NumberField label="Guests" defaultValue={10} step={5} />);
    const input = screen.getByRole('textbox', { name: 'Guests' });
    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');
    expect(input).toHaveValue('15');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(input).toHaveValue('5');
  });

  it('keeps the stepper buttons out of the tab order', () => {
    render(<NumberField label="Seats" />);
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Decrease' })).toHaveAttribute('tabindex', '-1');
  });

  it('lets the button names be translated', () => {
    render(<NumberField label="Seats" decrementLabel="Remove one" incrementLabel="Add one" />);
    expect(screen.getByRole('button', { name: 'Remove one' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add one' })).toBeInTheDocument();
  });

  it('formats the value with Intl.NumberFormat options', () => {
    render(
      <NumberField
        label="Price"
        defaultValue={1234.5}
        format={{ style: 'currency', currency: 'USD' }}
        locale="en-US"
      />,
    );
    expect(screen.getByRole('textbox', { name: 'Price' })).toHaveValue('$1,234.50');
  });

  it('describes the input with its hint', () => {
    render(<NumberField label="Seats" hint="Up to 50 per workspace." />);
    expect(screen.getByRole('textbox', { name: 'Seats' })).toHaveAccessibleDescription('Up to 50 per workspace.');
  });

  it('marks the input invalid and shows the error instead of the hint', () => {
    render(<NumberField label="Seats" hint="Hint text" error="Seats is required" />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Seats is required');
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
  });

  it('keeps the error on a disabled input, like Input', () => {
    render(<NumberField label="Seats" error="Seats is required" disabled />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
  });

  it('marks it required', () => {
    render(<NumberField label="Seats" required />);
    expect(screen.getByRole('textbox', { name: 'Seats' })).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('submits its value with a name', () => {
    render(
      <form aria-label="Order">
        <NumberField label="Seats" name="seats" defaultValue={4} />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Order' });
    expect(new FormData(form).get('seats')).toBe('4');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <NumberField label="Seats" hint="Up to 50 per workspace." defaultValue={5} />
        <NumberField label="Guests" error="Guests is required" required />
        <NumberField aria-label="Quantity" defaultValue={1} disabled />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
