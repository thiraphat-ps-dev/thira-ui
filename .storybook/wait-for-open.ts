import { expect, waitFor } from 'storybook/test';

/**
 * Waits until a popup/toast has finished its enter transition, so axe (which runs after `play`)
 * measures color contrast at full opacity. Base UI keeps `data-starting-style` for a frame after
 * mount, so the transition may not have started yet when the element is first found.
 */
export async function waitForOpen(...elements: Element[]) {
  await waitFor(() => {
    if (elements.some((el) => el.hasAttribute('data-starting-style'))) throw new Error('Still entering');
  });
  await Promise.allSettled(document.getAnimations().map((a) => a.finished));
  for (const el of elements) await expect(el).toBeVisible();
}
