---
'thira-ui': patch
---

Update `thira-icons` to `^0.2.0` and test against `thira-sans` 0.5. Icons given an `aria-label` or `aria-labelledby` are now exposed as `role="img"` instead of being hidden from assistive tech; the icons thira-ui renders itself are decorative and stay `aria-hidden`. With thira-sans 0.5+, Thai digits (๐–๙) are tabular too, so `Progress`, `Stat` and `Textarea` counters keep a steady width when they show Thai numerals.
