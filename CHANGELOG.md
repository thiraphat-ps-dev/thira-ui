# thira-ui

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
