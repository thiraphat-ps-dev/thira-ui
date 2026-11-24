---
'thira-ui': minor
---

Add `Slider`, `NumberField` and a minimal `Combobox`, built on Base UI and `Field` so they take `label`, `hint` and `error` like `Input`. `Slider` takes a single value or a range (two thumbs named "Minimum"/"Maximum", overridable with `thumbLabels`), `min`/`max`/`step`, `format` and an optional value readout. `NumberField` is a number input with −/+ buttons, `min`/`max`/`step` and `format` (`Intl.NumberFormatOptions`). `Combobox` picks one value from `items` filtered as you type; the value is always one of the items (no free text), with an empty-state message and a clear button.
