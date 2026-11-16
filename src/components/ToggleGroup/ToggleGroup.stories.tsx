import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ToggleGroup } from './ToggleGroup';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  args: { 'aria-label': 'Billing period', defaultValue: ['monthly'] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="monthly">Monthly</ToggleGroup.Item>
      <ToggleGroup.Item value="yearly">Yearly</ToggleGroup.Item>
      <ToggleGroup.Item value="lifetime" disabled>
        Lifetime
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A segmented control: one option at a time. */
export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
};

/** `multiple` turns the items into independent toggles. */
export const Multiple: Story = {
  args: { 'aria-label': 'Text style', multiple: true, defaultValue: ['bold'] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="bold" aria-label="Bold">
        <strong>B</strong>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="Italic">
        <em>I</em>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" aria-label="Underline">
        <u>U</u>
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
};

/** Keep one option always chosen by ignoring the empty array a second press sends. */
export const AlwaysOneSelected: Story = {
  render: () => {
    function Example() {
      const [lang, setLang] = useState('th');
      return (
        <ToggleGroup
          aria-label="Language"
          value={[lang]}
          onValueChange={(v) => {
            if (v[0]) setLang(v[0]);
          }}
        >
          <ToggleGroup.Item value="th" lang="th">
            ไทย
          </ToggleGroup.Item>
          <ToggleGroup.Item value="en">English</ToggleGroup.Item>
        </ToggleGroup>
      );
    }
    return <Example />;
  },
};

export const Vertical: Story = { args: { orientation: 'vertical' } };

export const Dark: Story = { globals: { theme: 'dark' } };
