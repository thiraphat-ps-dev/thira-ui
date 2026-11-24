---
'thira-ui': patch
---

`Select`'s popup now uses z-index 55, the same tier as `Menu`, `Popover` and `Combobox`, so a `Tooltip` (60) shows above an open Select list instead of tying with it.
