# thira-ui

## 0.8.0

### Minor Changes

- 8b89691: Component icons (Accordion and Select chevrons, Checkbox check and dash, Menu and Select check marks, Dialog and Toast close buttons) now come from `thira-icons`, the companion icon set, instead of hand-written inline SVGs. `thira-icons` is a new dependency; the icons keep the same size and line weight.

## 0.7.1

### Patch Changes

- 095636b: `--thira-font` now lists `'Thira Sans Fallback'` right after `'Thira Sans'`. With thira-sans 0.4+, text drawn before the font loads uses Arial/Tahoma resized to Thira Sans' metrics, so the swap no longer shifts layout.

## 0.7.0

### Minor Changes

- 47ab09a: Add Accordion, AlertDialog, Avatar (with `Avatar.Group` and `getInitials`) and Separator.

## 0.6.0

### Minor Changes

- 3f7e8e9: Add `ToggleGroup` (segmented control or multi-toggle), `Progress` (labelled progress bar with an indeterminate state), `Kbd` (keyboard key) and `Stat` (labelled number for dashboards).

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
