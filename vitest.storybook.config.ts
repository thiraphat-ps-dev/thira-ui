import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Runs every story in real Chromium, once per theme. Storybook's a11y addon runs axe after each
 * story (and its `play`), and `a11y.test: 'error'` in `.storybook/preview.tsx` fails the test on
 * any violation — including `color-contrast`, which the jsdom unit tests can't check.
 */
const themeProject = (theme: 'light' | 'dark') =>
  mergeConfig(viteConfig, {
    plugins: [storybookTest({ configDir: '.storybook', initialGlobals: { theme } })],
    test: {
      name: `storybook-${theme}`,
      // Drop the unit-test settings inherited from vite.config.ts (jsdom, setup file).
      environment: undefined,
      setupFiles: [],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  });

export default defineConfig({
  test: { projects: [themeProject('light'), themeProject('dark')] },
});
