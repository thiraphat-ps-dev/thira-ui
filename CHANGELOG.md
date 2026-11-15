# thira-ui

## 0.5.0

### Minor Changes

- 3f8d670: Add `Badge`: a small status label with five tones (neutral, accent, success, warning, danger), soft/solid/outline variants, two sizes, an optional dot and a `render` prop, plus new `--thira-warning` and `--thira-on-success` tokens.
- 3fcef94: Add `Spinner` (an announced status or a decorative loading indicator) and `Skeleton` (text, rect and circle placeholders with a reduced-motion-aware shimmer); `Button`'s loading state now renders `Spinner`.
- e79fe2b: Add `Radio` and `RadioGroup`: a labelled single-choice group with descriptions, hint/error text, arrow-key selection and a horizontal layout.
- 7a4fb26: Add `Textarea` with label, hint and error wiring, CSS-only auto-resize (`field-sizing: content`) and an optional character counter.

## 0.4.0

### Minor Changes

- f8fcbf5: The default font stack (`--thira-font`) now starts with Thira Sans, a Thai + Latin variable font. It is not bundled: install and import `thira-sans` to use it, otherwise text falls back to the system UI font as before. Storybook now shows components in Thira Sans.

## 0.3.0

### Minor Changes

- 4f56f84: Add `Menu`, a dropdown action menu with items (incl. danger tone and shortcut hints), groups, separators, and checkbox/radio items.
- 2f40382: Add `Popover`: a non-modal popup anchored to a trigger, with optional title/description, close part, side/align/arrow props, and controlled or uncontrolled state.
- 7b86f14: Add `Select`: a labelled dropdown built on Base UI's Select, with items as children or data, groups, placeholder, hint/error and controlled or uncontrolled value.

## 0.2.0

### Minor Changes

- `Card.Title` accepts a `render` prop so it can match your page's heading outline, e.g. `<Card.Title render={<h2 />}>`. It still renders an `<h3>` by default. Also exports the `CardTitleProps` type.

### Patch Changes

- README: add a "Using with Astro" section that covers static rendering and how to use the `render` prop from `.astro` files.
