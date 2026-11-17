---
'thira-ui': patch
---

`--thira-font` now lists `'Thira Sans Fallback'` right after `'Thira Sans'`. With thira-sans 0.4+, text drawn before the font loads uses Arial/Tahoma resized to Thira Sans' metrics, so the swap no longer shifts layout.
