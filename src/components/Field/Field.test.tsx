import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Field } from './Field';

describe('Field', () => {
  it('labels the control with a native label', () => {
    render(
      <Field label="Company">
        <Field.Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByText('Company')).toHaveAttribute('for', input.id);
    // `<label for>` already names it; no redundant aria-labelledby.
    expect(input).not.toHaveAttribute('aria-labelledby');
  });

  it('describes the control with its hint', () => {
    render(
      <Field label="Company" hint="As it appears on invoices.">
        <Field.Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toHaveAccessibleDescription('As it appears on invoices.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('marks the control invalid and shows the error instead of the hint', () => {
    render(
      <Field label="Company" hint="As it appears on invoices." error="Company is required">
        <Field.Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Company is required');
    expect(screen.queryByText('As it appears on invoices.')).not.toBeInTheDocument();
  });

  it('switches between hint and error when the error changes', () => {
    const { rerender } = render(
      <Field label="Company" hint="Hint text">
        <Field.Control />
      </Field>,
    );
    rerender(
      <Field label="Company" hint="Hint text" error="Error text">
        <Field.Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toHaveAccessibleDescription('Error text');
    rerender(
      <Field label="Company" hint="Hint text">
        <Field.Control />
      </Field>,
    );
    expect(input).toHaveAccessibleDescription('Hint text');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('keeps aria-invalid while disabled, like a plain input with an error', () => {
    render(
      <Field label="Company" error="Company is required" disabled>
        <Field.Control />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Company is required');
  });

  it('shows a required marker hidden from assistive tech', () => {
    render(
      <Field label="Company" required>
        <Field.Control required />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Company' })).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not mark the control invalid from native validation (only `error` does)', async () => {
    render(
      <Field label="Email">
        <Field.Control type="email" required />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    await userEvent.type(input, 'not-an-email{Enter}');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('lets the control keep its own id, ref, aria-describedby and handlers', async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(
      <>
        <p id="external">External note</p>
        <Field label="Company" hint="Hint text">
          <Field.Control id="company" ref={ref} aria-describedby="external" onChange={onChange} />
        </Field>
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toHaveAttribute('id', 'company');
    expect(ref.current).toBe(input);
    // Same as a plain input: an explicit aria-describedby replaces the generated one.
    expect(input).toHaveAccessibleDescription('External note');
    await userEvent.type(input, 'Acme');
    expect(input).toHaveValue('Acme');
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('uses messageId for the hint/error element', () => {
    render(
      <Field label="Company" hint="Hint text" messageId="company-message">
        <Field.Control />
      </Field>,
    );
    expect(screen.getByText('Hint text')).toHaveAttribute('id', 'company-message');
  });

  it('labels a non-native control with aria-labelledby when nativeLabel is false', () => {
    render(
      <Field label="Accept terms" hint="Required to continue." nativeLabel={false}>
        <BaseCheckbox.Root />
      </Field>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveAccessibleDescription('Required to continue.');
    expect(screen.getByText('Accept terms').tagName).toBe('DIV');
  });

  it('supports a custom layout with parts', () => {
    render(
      <Field invalid>
        <Field.Label required>Company</Field.Label>
        <Field.Control />
        <Field.Error>Company is required</Field.Error>
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Company' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Company is required');
  });

  it('has no axe violations with a hint, an error and disabled', async () => {
    render(
      <>
        <Field label="Company" hint="As it appears on invoices.">
          <Field.Control />
        </Field>
        <Field label="Tax ID" error="Tax ID is required" required>
          <Field.Control required />
        </Field>
        <Field label="Account" hint="Managed by your admin." disabled>
          <Field.Control defaultValue="acme" />
        </Field>
      </>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
