# thira-ui — guide for Claude

Accessible React component library: **Base UI primitives + modern CSS (CSS Modules, CSS variables, `@layer`)**, no CSS-in-JS. Public, MIT, early (v0.x), published to npm as `thira-ui`.

- Repo: https://github.com/thiraphat-ps-dev/thira-ui (public)
- Live Storybook: https://thiraphat-ps-dev.github.io/thira-ui/ (auto-deployed by CI on push to `main`)
- Write-up of the design decisions: see "Further reading" in `README.md`

## Working with the maintainer

- **Talk to the maintainer in Thai.** Keep code, comments, commit messages, README and docs in English.
- Commit locally whenever a piece of work is done and `npm run check` passes.
- **Ask before:** pushing to GitHub, publishing to npm, bumping the version, changing repo settings, or adding a runtime dependency.
- Prefer small, reviewable changes. If a decision below seems wrong, raise it instead of silently changing it.

## Commands

| Command                               | What it does                                                                |
| ------------------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`                         | Storybook on http://localhost:6006                                          |
| `npm run check`                       | typecheck + lint + format check + tests — **must pass before every commit** |
| `npm test` / `npm run test:watch`     | Vitest (jsdom + Testing Library)                                            |
| `npm run build`                       | Library build to `dist/` (Vite lib mode + `tsc` for `.d.ts`)                |
| `npm run build-storybook`             | Static Storybook to `storybook-static/`                                     |
| `npm run lint:fix` / `npm run format` | Auto-fix lint / Prettier                                                    |

CI (`.github/workflows/ci.yml`, Node 24) runs typecheck → lint → format → test → build → build-storybook, then deploys Storybook to GitHub Pages on `main`.

## Releasing

1. For every user-facing change, add a changeset: `npx changeset` (pick patch/minor; it writes `.changeset/*.md`).
2. To release: `npx changeset version` (bumps `package.json`, writes `CHANGELOG.md`), commit, then tag `vX.Y.Z` and push the tag.
3. `.github/workflows/release.yml` publishes from CI via npm trusted publishing (OIDC, provenance; no token). It fails if the tag ≠ `package.json` version.
4. `prepublishOnly` runs `npm run check && npm run build`, so a broken package can't be published.

**Ask the maintainer before running steps 2–3** (version bumps and publishing are on the "ask first" list).

## Layout

```
src/
  index.ts                 public exports (also imports tokens.css)
  styles/tokens.css        design tokens (--thira-*), light/dark themes
  utils/cx.ts              className joiner
  components/<Name>/
    <Name>.tsx             component
    <Name>.module.css      styles, wrapped in @layer thira
    <Name>.stories.tsx     Storybook stories
    <Name>.test.tsx        Vitest tests
.storybook/                main.ts, preview.tsx (theme toolbar + ToastProvider), preview.css
docs/banner.jpg            README banner
```

## Architecture decisions (keep these unless the maintainer agrees to change them)

1. **Base UI (`@base-ui/react`) for behavior and accessibility**, not Radix. Use the `render` prop, never `asChild`.
   - Read the bundled docs before using a Base UI part: `node_modules/@base-ui/react/docs/react/components/<name>.md` (and `handbook/`, `utils/use-render.md`). They are authoritative for the installed version.
2. **React 19+ only.** `ref` is a normal prop — do not use `forwardRef`. Type props with `ComponentProps<'el'>` / `ComponentProps<typeof BasePart>`.
3. **Styling = CSS Modules + design tokens.** No CSS-in-JS, no Tailwind in the library.
   - Every `.module.css` file is wrapped in `@layer thira { … }` so unlayered app CSS always wins. Tokens are in the same layer.
   - Use `--thira-*` tokens for color, spacing, radius, type, shadow, motion. Don't hard-code colors.
   - Derived colors use relative color syntax, e.g. `oklch(from var(--thira-accent) calc(l - 0.06) c h)`.
   - Style state through data attributes Base UI provides (`[data-disabled]`, `[data-starting-style]`, `[data-ending-style]`, …).
   - Class names in the build are `thira-<File>-module__<class>` (see `vite.config.ts`).
4. **Theming:** dark mode follows the OS; `<html data-theme="dark|light">` forces it. To theme a subtree, the element needs `data-thira-theme` so derived tokens recompute there (custom properties resolve where they're declared).
5. **Compound components** are built with `Object.assign(Root, { Part: … })` (see `Card`, `Dialog`). Parts that may need a different element (e.g. `Card.Title` heading level) take a `render` prop via `useRender` + `mergeProps`.
6. **Button**: native `<button>` goes through Base UI `Button`; with `render` (e.g. a link) it goes through `useRender` so the element keeps its own role. Don't regress this — a link must not get `role="button"`.
7. **Toast** API is `ToastProvider` + `useToast()` (`toast()` / `dismiss()`), wrapping Base UI's toast manager.

## Adding a component — checklist

- [ ] Read the Base UI doc for the primitive (if any).
- [ ] `src/components/<Name>/` with `.tsx`, `.module.css` (in `@layer thira`), `.stories.tsx`, `.test.tsx`.
- [ ] Export it (and its prop types) from `src/index.ts`.
- [ ] Tests query by role/label (`getByRole`, `getByLabelText`), not by class or test id.
- [ ] Stories cover variants/states; check light **and** dark with the theme toolbar.
- [ ] Accessibility: no axe violations in either theme (Storybook "Accessibility" tab). Text on colored backgrounds must reach **4.5:1** — use an `--thira-on-*` token if needed.
- [ ] Overlays/transient UI (dialogs, toasts, popups): add a story `play` that opens it (Storybook's axe runs after `play`), and a test with `await expect(document.body).toHaveNoAxeViolations()` (matcher in `src/test-setup.ts`; `color-contrast` is off there because jsdom can't compute it).
- [ ] **Sample content in stories/tests/docs must be generic** (e.g. "Alex Morgan", example.com, "Team plan"). Never use the maintainer's name, links, or their other projects.
- [ ] Add a row to the Components table in `README.md`.
- [ ] `npm run check` and `npm run build` pass; check `dist/index.js` size didn't jump (a big jump usually means a dependency got bundled — keep `react`, `react-dom`, `@base-ui/*` external in `vite.config.ts`).

## Gotchas

- **Windows + Vitest:** run from a path with an uppercase drive letter (`C:\…`). From lowercase `c:` Vitest loads twice and fails with "Invalid Chai property" / "failed to find the current suite". In Git Bash use `cd /C/thira-works/projects/thira-ui`.
- **TypeScript is pinned to 6.0** because typescript-eslint doesn't support TS 7 yet. **ESLint is pinned to 9** because `eslint-plugin-jsx-a11y` doesn't support ESLint 10 yet. Revisit when they do.
- ESLint runs `strictTypeChecked` — prefer fixing the code over disabling rules; if a rule must be relaxed, scope it narrowly in `eslint.config.js` with a comment.
- Toast: Base UI sets `aria-hidden` on high-priority toasts (announced via a separate live region) and on the close button until the viewport is hovered/focused; both clear on focus. axe's `aria-hidden-focus` is disabled for the Toast stories for that reason — don't "fix" it by overriding Base UI.
- Portaled popups (Menu, Select, Popover) sit outside any landmark, so the jsdom axe matcher turns off axe's `region` rule (Storybook's a11y addon does the same by default).
- Select, Menu and Popover stories disable `aria-hidden-focus`: while the popup is open Base UI adds `aria-hidden` focus-guard spans with `tabindex=0` that forward focus. Same reasoning as Toast.
- Layering: Dialog 50–51, Menu/Popover 55, Tooltip 60. Keep new floating parts in this order.
- Status colours: `--thira-success` / `--thira-warning` / `--thira-danger` each have `--thira-on-*` (text on solid) and `*-soft` (12% tint). White on the success green is only ~4.2:1, so `--thira-on-success` is dark. Badge's soft/outline text mixes the tone with `--thira-text` (warning needs 50%) to stay ≥ 4.5:1 in both themes.
- Button's loading state renders `<Spinner label={null} />` (decorative; the button carries `aria-busy`). Spinner pulses instead of spinning under reduced motion.
- `role="status"` doesn't take its name from content, so Spinner points `aria-labelledby` at its hidden label.
- Select builds its value→label lookup by walking its children for `Select.Item`; items wrapped in custom components need the `items` prop.
- jsdom lacks some browser APIs; Base UI's toast close button is `aria-hidden`, so tests click it via its `aria-label`.
- Line endings are LF everywhere (`.gitattributes`, `.editorconfig`, Prettier).

## Known gaps / ideas

- Storybook's axe results aren't enforced in CI (only `npm run check`'s jsdom axe tests are, and they skip color contrast).
- Not yet: Combobox, DatePicker (Buddhist calendar), Table. Add them when a real app needs them, so the API comes from use.
