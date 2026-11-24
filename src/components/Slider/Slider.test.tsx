import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';

describe('Slider', () => {
  it('names the group and the thumb with its label', () => {
    render(<Slider label="Volume" defaultValue={40} />);
    expect(screen.getByRole('group', { name: 'Volume' })).toBeInTheDocument();
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    expect(thumb).toHaveAttribute('min', '0');
    expect(thumb).toHaveAttribute('max', '100');
  });

  it('takes an aria-label when there is no visible label', () => {
    render(<Slider aria-label="Brightness" defaultValue={10} />);
    expect(screen.getByRole('slider', { name: 'Brightness' })).toHaveAttribute('aria-valuenow', '10');
  });

  it('moves with the keyboard by step, and by largeStep with Shift', async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={40} step={5} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    act(() => {
      thumb.focus();
    });
    await userEvent.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '45');
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(thumb).toHaveAttribute('aria-valuenow', '35');
    await userEvent.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    expect(onValueChange).toHaveBeenLastCalledWith(100, expect.anything());
  });

  it('respects min, max and step', () => {
    render(<Slider label="Rating" min={1} max={5} step={0.5} defaultValue={3} />);
    const thumb = screen.getByRole('slider', { name: 'Rating' });
    expect(thumb).toHaveAttribute('min', '1');
    expect(thumb).toHaveAttribute('max', '5');
    expect(thumb).toHaveAttribute('step', '0.5');
  });

  it('renders two named thumbs for a range', () => {
    render(<Slider label="Price" defaultValue={[20, 80]} />);
    expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveAttribute('aria-valuenow', '20');
    expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveAttribute('aria-valuenow', '80');
  });

  it('lets the range thumb names be overridden', () => {
    render(<Slider label="Opening hours" defaultValue={[9, 17]} min={0} max={24} thumbLabels={['Opens', 'Closes']} />);
    expect(screen.getByRole('slider', { name: 'Opens' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Closes' })).toBeInTheDocument();
  });

  it('keeps range thumbs from crossing with the keyboard', async () => {
    render(<Slider label="Price" defaultValue={[40, 50]} step={10} />);
    const min = screen.getByRole('slider', { name: 'Minimum' });
    act(() => {
      min.focus();
    });
    await userEvent.keyboard('{End}');
    expect(min).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows the formatted value when asked', () => {
    render(
      <Slider
        label="Discount"
        defaultValue={0.25}
        min={0}
        max={1}
        step={0.05}
        format={{ style: 'percent' }}
        showValue
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('25%');
  });

  it('shows both ends of a range', () => {
    render(<Slider label="Price" defaultValue={[20, 80]} showValue />);
    expect(screen.getByRole('status').textContent).toBe('20 – 80');
  });

  it('describes the thumb with its hint', () => {
    render(<Slider label="Volume" hint="Applies to all devices." defaultValue={40} />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAccessibleDescription('Applies to all devices.');
  });

  it('marks the slider invalid and shows the error instead of the hint', () => {
    render(<Slider label="Budget" hint="Hint text" error="Budget is too low" defaultValue={5} />);
    const thumb = screen.getByRole('slider', { name: 'Budget' });
    expect(thumb).toHaveAttribute('aria-invalid', 'true');
    expect(thumb).toHaveAccessibleDescription('Budget is too low');
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Slider label="Volume" defaultValue={40} disabled />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeDisabled();
  });

  it('submits its value with a name', () => {
    render(
      <form aria-label="Settings">
        <Slider label="Volume" name="volume" defaultValue={40} />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Settings' });
    expect(new FormData(form).get('volume')).toBe('40');
  });

  it('has no axe violations', async () => {
    render(
      <main>
        <Slider label="Volume" hint="Applies to all devices." defaultValue={40} showValue />
        <Slider label="Price" defaultValue={[20, 80]} error="Range is too wide" />
        <Slider aria-label="Brightness" defaultValue={10} disabled />
      </main>,
    );
    await expect(document.body).toHaveNoAxeViolations();
  });
});
