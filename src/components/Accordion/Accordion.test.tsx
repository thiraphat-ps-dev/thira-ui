import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, type AccordionProps } from './Accordion';

function Faq(props: Omit<AccordionProps, 'children'>) {
  return (
    <Accordion {...props}>
      <Accordion.Item value="billing" title="How does billing work?">
        Billed monthly.
      </Accordion.Item>
      <Accordion.Item value="cancel" title="Can I cancel any time?">
        Yes, from settings.
      </Accordion.Item>
      <Accordion.Item value="legacy" title="Legacy plans" disabled>
        Retired.
      </Accordion.Item>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('wraps each trigger in a heading, level 3 by default', () => {
    render(<Faq />);
    expect(screen.getByRole('heading', { level: 3, name: 'How does billing work?' })).toBeInTheDocument();
  });

  it('honours headingLevel', () => {
    render(
      <Accordion>
        <Accordion.Item title="Shipping" headingLevel={2}>
          Two days.
        </Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Shipping' })).toBeInTheDocument();
  });

  it('opens a panel on click and keeps one open at a time', async () => {
    render(<Faq />);
    expect(trigger('How does billing work?')).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger('How does billing work?'));
    expect(trigger('How does billing work?')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Billed monthly.')).toBeVisible();

    await userEvent.click(trigger('Can I cancel any time?'));
    expect(trigger('Can I cancel any time?')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('How does billing work?')).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows several open items with `multiple`', async () => {
    render(<Faq multiple />);
    await userEvent.click(trigger('How does billing work?'));
    await userEvent.click(trigger('Can I cancel any time?'));
    expect(trigger('How does billing work?')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('Can I cancel any time?')).toHaveAttribute('aria-expanded', 'true');
  });

  it('respects defaultValue and disabled items', async () => {
    render(<Faq defaultValue={['cancel']} />);
    expect(trigger('Can I cancel any time?')).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger('Legacy plans'));
    expect(trigger('Legacy plans')).toHaveAttribute('aria-expanded', 'false');
  });

  it('links the panel to its trigger and has no axe violations', async () => {
    const { container } = render(<Faq defaultValue={['billing']} />);
    const panel = screen.getByRole('region', { name: 'How does billing work?' });
    expect(panel).toHaveTextContent('Billed monthly.');
    await expect(container).toHaveNoAxeViolations();
  });
});
