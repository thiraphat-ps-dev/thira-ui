import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/styles/tokens.css';
import { ToastProvider } from '../src';
import './preview.css';

/** Applies the toolbar theme to <html data-theme> so tokens switch exactly like in a real app. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark' | 'system';
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);
  return <Story />;
};

const withToasts: Decorator = (Story) => (
  <ToastProvider>
    <Story />
  </ToastProvider>
);

const preview: Preview = {
  decorators: [withToasts, withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System', icon: 'browser' },
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system' },
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
    backgrounds: { disable: true },
    a11y: { test: 'error' },
  },
  tags: ['autodocs'],
};

export default preview;
