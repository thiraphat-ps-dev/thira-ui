import * as matchers from '@testing-library/jest-dom/matchers';
import axe from 'axe-core';
import { expect } from 'vitest';

expect.extend(matchers);

expect.extend({
  /** Runs axe-core on the element (e.g. `document.body`, to include portals) and fails on any violation. */
  async toHaveNoAxeViolations(received: Element) {
    const { violations } = await axe.run(received, {
      // jsdom has no layout or rendering, so axe can't compute color contrast here.
      // Contrast is checked in Storybook's Accessibility panel (real browser, both themes).
      // `region` is off for the same reason Storybook's a11y addon turns it off: components are
      // tested without page landmarks, and portaled popups (e.g. role="menu") sit outside them.
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? 'Expected axe violations, found none'
          : `Expected no axe violations, found:\n${violations
              .map((v) => `- ${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
              .join('\n')}`,
    };
  },
});

declare module 'vitest' {
  // Type parameter must match Vitest's own declaration to merge.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoAxeViolations: () => Promise<void>;
  }
}
