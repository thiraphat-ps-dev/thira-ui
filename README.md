# thira-ui

![thira-ui — an accessible React UI library built on Base UI and modern CSS](./docs/banner.jpg)

[![CI](https://github.com/thiraphat-ps-dev/thira-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/thiraphat-ps-dev/thira-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-live_demo-FF4785?logo=storybook&logoColor=white)](https://thiraphat-ps-dev.github.io/thira-ui/)
[![Medium](https://img.shields.io/badge/Medium-read_the_story-000000?logo=medium&logoColor=white)](https://thiraphat-ps-dev.medium.com/building-a-react-ui-library-with-native-css-lessons-from-thira-ui-69975f7c3607)

A minimal, accessible React component library built on [Base UI](https://base-ui.com) primitives and modern CSS.

**[▶ Live demo (Storybook)](https://thiraphat-ps-dev.github.io/thira-ui/)** · **[📖 How it was built](https://thiraphat-ps-dev.medium.com/building-a-react-ui-library-with-native-css-lessons-from-thira-ui-69975f7c3607)**

- **Accessible by default.** Focus management, keyboard support and ARIA come from Base UI; every story is checked with axe in light and dark mode.
- **Modern CSS, zero runtime.** CSS Modules, CSS variables, nesting and `oklch()` relative colors — no CSS-in-JS.
- **Easy to override.** All styles live in `@layer thira`, so your own CSS always wins without `!important`.
- **Themeable with one variable.** Change `--thira-hue` and every accent, hover and focus color follows.

> **Status:** early (v0.1). APIs may change before 1.0. Not published to npm yet.

## Components

| Component  | Notes                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| `Button`   | `solid` · `outline` · `ghost` · `danger`, three sizes, `loading` state, `render` prop for links              |
| `Input`    | Label, hint and error wired up with `aria-describedby` / `aria-invalid`                                      |
| `Checkbox` | Label + description wired up; `indeterminate` (`aria-checked="mixed"`); `CheckboxGroup` with parent checkbox |
| `Card`     | Compound API: `Card.Header`, `Card.Title`, `Card.Description`, `Card.Body`, `Card.Footer`                    |
| `Dialog`   | Modal with focus trap, Esc to close, scroll lock, nested dialogs                                             |
| `Toast`    | `ToastProvider` + `useToast()`; stacked toasts, swipe to dismiss, action button                              |

## Usage

Requires React 19+.

```tsx
import { Button, Dialog, ToastProvider, useToast } from 'thira-ui';
import 'thira-ui/styles.css';

function App() {
  return (
    <ToastProvider>
      <DeleteProject />
    </ToastProvider>
  );
}

function DeleteProject() {
  const { toast } = useToast();
  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="danger" />}>Delete project</Dialog.Trigger>
      <Dialog.Content title="Delete this project?" description="This cannot be undone.">
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
          <Dialog.Close
            render={<Button variant="danger" />}
            onClick={() => toast({ title: 'Project deleted', tone: 'danger' })}
          >
            Delete
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
```

## Theming

Every design token is a CSS variable prefixed with `--thira-`. Override them on `:root`:

```css
:root {
  --thira-hue: 160; /* green accent */
  --thira-radius-md: 4px;
  --thira-font: 'Inter', system-ui, sans-serif;
}
```

Dark mode follows the OS. Force a theme with `<html data-theme="dark">` or `data-theme="light"`.

To theme only part of a page, add `data-thira-theme` so derived colors recompute there:

```html
<section data-thira-theme style="--thira-hue: 320">…</section>
```

## Development

```bash
npm install
npm run dev     # Storybook on http://localhost:6006
npm run check   # typecheck + lint + format check + tests
npm run build   # library build to dist/
```

## Further reading

The design decisions behind thira-ui — headless primitives, `oklch()` tokens, `@layer` — and the bugs found along the way:

- **English:** [Building a React UI Library with Native CSS: Lessons from thira-ui](https://thiraphat-ps-dev.medium.com/building-a-react-ui-library-with-native-css-lessons-from-thira-ui-69975f7c3607)
- **ภาษาไทย:** [สร้าง React UI Library ด้วย Native CSS: บทเรียนจาก thira-ui](https://medium.com/p/2df3821712ae)

## License

[MIT](./LICENSE) © Thiraphat Phutson
