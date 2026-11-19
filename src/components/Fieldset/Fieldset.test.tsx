import { render, screen } from '@testing-library/react';
import { Input } from '../Input/Input';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a group named by its legend', () => {
    render(
      <Fieldset legend="Billing details">
        <Input label="Company" />
      </Fieldset>,
    );
    const group = screen.getByRole('group', { name: 'Billing details' });
    expect(group.tagName).toBe('FIELDSET');
  });

  it('describes the group with its hint, or the error instead', () => {
    const { rerender } = render(<Fieldset legend="Billing details" hint="Shown on invoices." />);
    const group = screen.getByRole('group', { name: 'Billing details' });
    expect(group).toHaveAccessibleDescription('Shown on invoices.');
    expect(group).not.toHaveAttribute('aria-invalid');
    rerender(<Fieldset legend="Billing details" hint="Shown on invoices." error="Fix the fields below." />);
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Fix the fields below.');
  });

  it('disables the controls inside', () => {
    render(
      <Fieldset legend="Billing details" disabled>
        <Input label="Company" />
      </Fieldset>,
    );
    expect(screen.getByRole('textbox', { name: 'Company' })).toBeDisabled();
  });

  it('shows a required marker hidden from assistive tech', () => {
    render(<Fieldset legend="Billing details" required />);
    expect(screen.getByRole('group', { name: 'Billing details' })).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations', async () => {
    render(
      <Fieldset legend="Billing details" error="Fix the fields below.">
        <Input label="Company" error="Company is required" />
        <Input label="Tax ID" />
      </Fieldset>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
