---
'thira-ui': minor
---

Add `Field` and `Fieldset`, built on Base UI's `Field` and `Fieldset`. `Field` wires a label, hint and error to one control (`Field.Control`, or a Base UI control such as `Select` or `Checkbox`) and has parts for custom layouts; `Fieldset` groups fields under a legend with a group hint/error. `Input`, `Textarea`, `Select` and `RadioGroup` now use them internally; their props and accessible names, descriptions and invalid states are unchanged.
