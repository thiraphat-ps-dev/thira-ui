# Changesets

Run `npx changeset` to describe a change (patch / minor / major) before merging it.
`npx changeset version` bumps `package.json` and writes `CHANGELOG.md`.
Pushing a `v*` tag publishes to npm from CI (see `.github/workflows/release.yml`).
