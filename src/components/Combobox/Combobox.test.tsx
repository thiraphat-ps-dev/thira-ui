import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Combobox, type ComboboxProps } from './Combobox';

const countries = [
  { value: 'ca', label: 'Canada' },
  { value: 'jp', label: 'Japan' },
  { value: 'jo', label: 'Jordan' },
  { value: 'th', label: 'Thailand' },
];

function Countries(props: Partial<ComboboxProps>) {
  return <Combobox label="Country" placeholder="Search countries" items={countries} {...props} />;
}

describe('Combobox', () => {
  it('names the input with its label', () => {
    render(<Countries />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('placeholder', 'Search countries');
  });

  it('shows the selected label (not the raw value)', () => {
    render(<Countries defaultValue="jp" />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveValue('Japan');
  });

  it('filters the options as the user types and selects one', async () => {
    const onValueChange = vi.fn();
    render(<Countries onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'j');
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Japan', 'Jordan']);

    await userEvent.click(screen.getByRole('option', { name: 'Jordan' }));
    expect(onValueChange).toHaveBeenCalledWith('jo', expect.anything());
    expect(input).toHaveValue('Jordan');
  });

  it('selects with the keyboard', async () => {
    render(<Countries />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.type(input, 'tha');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(input).toHaveValue('Thailand');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the empty message when nothing matches', async () => {
    render(<Countries emptyMessage="No countries found" />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Country' }), 'zz');
    expect(await screen.findByText('No countries found')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('is strict: unmatched text does not become the value', async () => {
    render(
      <form aria-label="Address">
        <Countries name="country" defaultValue="jp" />
      </form>,
    );
    const input = screen.getByRole('combobox', { name: 'Country' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Atlantis');
    await userEvent.tab();
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Address' });
    expect(new FormData(form).get('country')).not.toBe('Atlantis');
  });

  it('submits the selected value with a name', () => {
    render(
      <form aria-label="Address">
        <Countries name="country" defaultValue="th" />
      </form>,
    );
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Address' });
    expect(new FormData(form).get('country')).toBe('th');
  });

  it('clears the value with the clear button', async () => {
    const onValueChange = vi.fn();
    render(<Countries defaultValue="th" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onValueChange).toHaveBeenCalledWith(null, expect.anything());
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveValue('');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>('ca');
      return (
        <>
          <Countries value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toHaveValue('Canada');
    await userEvent.clear(input);
    await userEvent.type(input, 'jap');
    await userEvent.click(await screen.findByRole('option', { name: 'Japan' }));
    expect(screen.getByRole('status').textContent).toBe('jp');
    expect(input).toHaveValue('Japan');
  });

  it('marks disabled items', async () => {
    render(<Countries items={[...countries, { value: 'xx', label: 'Closed region', disabled: true }]} />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Country' }), 'closed');
    expect(await screen.findByRole('option', { name: 'Closed region' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('can be disabled', () => {
    render(<Countries disabled defaultValue="th" />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeDisabled();
  });

  it('describes the input with its hint, or the error instead', () => {
    const { rerender } = render(<Countries hint="Where the invoice is sent." />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveAccessibleDescription('Where the invoice is sent.');

    rerender(<Countries hint="Where the invoice is sent." error="Choose a country" />);
    const input = screen.getByRole('combobox', { name: 'Country' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Choose a country');
  });

  it('takes an aria-label when there is no visible label', () => {
    render(<Combobox aria-label="Country" items={countries} />);
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
  });

  it('has no axe violations when open', async () => {
    const { container } = render(<Countries defaultValue="jp" hint="Where the invoice is sent." />);
    await userEvent.click(screen.getByRole('button', { name: 'Country' }));
    const listbox = await screen.findByRole('listbox');
    const portal = listbox.closest('[data-base-ui-portal]');
    if (!portal) throw new Error('popup is not portaled');
    await expect(container).toHaveNoAxeViolations();
    await expect(portal).toHaveNoAxeViolations();
  });
});
