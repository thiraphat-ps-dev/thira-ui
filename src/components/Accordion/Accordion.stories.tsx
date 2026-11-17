import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: { variant: { control: 'inline-radio', options: ['outline', 'plain'] } },
  args: { variant: 'outline' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (
  <>
    <Accordion.Item value="billing" title="How does billing work?">
      The Team plan is billed monthly per member. You can switch to yearly billing at any time and save two months.
    </Accordion.Item>
    <Accordion.Item value="cancel" title="Can I cancel any time?">
      Yes. Cancel from the billing settings and your plan stays active until the end of the period.
    </Accordion.Item>
    <Accordion.Item value="data" title="What happens to my data?">
      Projects are kept for 30 days after cancelling, so you can export them or come back.
    </Accordion.Item>
  </>
);

export const Default: Story = { args: { defaultValue: ['billing'], children: items } };

/** No outer box: only lines between items, for FAQ pages. */
export const Plain: Story = { args: { variant: 'plain', children: items } };

export const Multiple: Story = { args: { multiple: true, defaultValue: ['billing', 'data'], children: items } };

export const DisabledItem: Story = {
  args: {
    children: (
      <>
        <Accordion.Item title="Account">Name, email and password.</Accordion.Item>
        <Accordion.Item title="Single sign-on (Enterprise only)" disabled>
          Connect your identity provider.
        </Accordion.Item>
      </>
    ),
  },
};

/** `hiddenUntilFound` lets the browser's find-in-page (Ctrl+F) search closed panels and open them. */
export const FindInPage: Story = { args: { hiddenUntilFound: true, children: items } };

export const Dark: Story = { globals: { theme: 'dark' }, args: { defaultValue: ['billing'], children: items } };
