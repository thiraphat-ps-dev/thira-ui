import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('links the label to the textarea', () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInstanceOf(HTMLTextAreaElement);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
  });

  it('describes the textarea with its hint', () => {
    render(<Textarea label="Message" hint="Keep it short." />);
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Keep it short.');
  });

  it('marks the textarea invalid and shows the error instead of the hint', () => {
    render(<Textarea label="Message" hint="Keep it short." error="Message is required" />);
    const textarea = screen.getByLabelText('Message');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Message is required');
    expect(screen.queryByText('Keep it short.')).not.toBeInTheDocument();
  });

  it('marks the field required with a hidden visual marker', () => {
    render(<Textarea label="Message" required />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts typing when uncontrolled', async () => {
    render(<Textarea label="Message" defaultValue="Hi" />);
    const textarea = screen.getByLabelText('Message');
    await userEvent.type(textarea, ' there');
    expect(textarea).toHaveValue('Hi there');
  });

  it('works when controlled', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <Textarea
          label="Message"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setValue(event.target.value.toUpperCase());
          }}
        />
      );
    }
    render(<Controlled />);
    const textarea = screen.getByLabelText('Message');
    await userEvent.type(textarea, 'abc');
    expect(textarea).toHaveValue('ABC');
    expect(onChange).toHaveBeenLastCalledWith('ABc');
  });

  it('shows a character counter linked to the textarea', async () => {
    render(<Textarea label="Bio" hint="Public." maxLength={10} showCount defaultValue="Hey" />);
    const textarea = screen.getByLabelText('Bio');
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
    expect(textarea).toHaveAccessibleDescription('Public. 3 of 10 characters used');

    await userEvent.type(textarea, ' there!!!!');
    expect(textarea).toHaveValue('Hey there!');
    expect(screen.getByText('10 / 10')).toBeInTheDocument();
  });

  it('does not make the counter a live region', () => {
    render(<Textarea label="Bio" maxLength={10} showCount />);
    expect(screen.getByText('0 / 10').closest('[aria-live]')).toBeNull();
  });

  it('counts a controlled value and works without maxLength', () => {
    render(<Textarea label="Notes" showCount value="12345" onChange={() => undefined} />);
    expect(screen.getByLabelText('Notes')).toHaveAccessibleDescription('5 characters');
  });

  it('sets rows from minRows and CSS variables when autoResize is on', () => {
    render(<Textarea label="Notes" autoResize minRows={3} maxRows={8} style={{ color: 'red' }} />);
    const textarea = screen.getByLabelText('Notes');
    expect(textarea).toHaveAttribute('rows', '3');
    expect(textarea.style.getPropertyValue('--thira-textarea-min-rows')).toBe('3');
    expect(textarea.style.getPropertyValue('--thira-textarea-max-rows')).toBe('8');
    expect(textarea.style.color).toBe('red');
  });

  it('forwards ref to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea label="Message" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText('Message'));
  });

  it('merges className onto the wrapper', () => {
    const { container } = render(<Textarea label="Message" className="custom" />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass('custom');
    expect(wrapper?.className).not.toBe('custom');
  });

  it('respects a custom id', () => {
    render(<Textarea label="Message" id="custom" />);
    expect(screen.getByLabelText('Message')).toHaveAttribute('id', 'custom');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Textarea label="Message" hint="Keep it short." required />
        <Textarea label="Bio" error="Too long" maxLength={20} showCount autoResize maxRows={4} />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });

  it('keeps the hint/error before the counter in the description when the error changes', () => {
    const { rerender } = render(<Textarea label="Bio" hint="Public." showCount maxLength={10} />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAccessibleDescription('Public. 0 of 10 characters used');
    rerender(<Textarea label="Bio" hint="Public." error="Too long" showCount maxLength={10} />);
    expect(textarea).toHaveAccessibleDescription('Too long 0 of 10 characters used');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    rerender(<Textarea label="Bio" showCount maxLength={10} />);
    expect(textarea).toHaveAccessibleDescription('0 of 10 characters used');
    expect(textarea).not.toHaveAttribute('aria-invalid');
  });
});
