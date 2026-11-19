import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('has no axe violations with a hint and with an error', async () => {
    render(
      <>
        <Input label="Email" hint="We never share it." />
        <Input label="Name" error="Name is required" />
      </>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });

  it('links the label to the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement);
  });

  it('describes the input with its hint', () => {
    render(<Input label="Email" hint="We never share it." />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('We never share it.');
  });

  it('marks the input invalid and shows the error instead of the hint', () => {
    render(<Input label="Email" hint="We never share it." error="Email is required" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email is required');
    expect(screen.queryByText('We never share it.')).not.toBeInTheDocument();
  });

  it('accepts typing', async () => {
    render(<Input label="Name" />);
    const input = screen.getByLabelText('Name');
    await userEvent.type(input, 'Thira');
    expect(input).toHaveValue('Thira');
  });

  it('respects a custom id', () => {
    render(<Input label="Name" id="custom" />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'custom');
  });

  it('keeps the error on a disabled input', () => {
    render(<Input label="Email" error="Email is required" disabled />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email is required');
  });

  it('lets an explicit aria-describedby replace the hint link', () => {
    render(
      <>
        <p id="external">External note</p>
        <Input label="Email" hint="We never share it." aria-describedby="external" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('External note');
  });

  it('keeps the hint id derived from the input id', () => {
    render(<Input label="Name" id="custom" hint="Hint text" />);
    expect(screen.getByText('Hint text')).toHaveAttribute('id', 'custom-message');
  });
});
