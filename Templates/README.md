# Obsidian Mermaid Template Pack

## Contents

- `Templates/Mermaid/*.md`: Mermaid snippets
- `_scripts/insert-mermaid.js`: QuickAdd user script

## Install

Copy both folders into your Obsidian Vault root.

```text
YourVault/
├── Templates/
│   └── Mermaid/
└── _scripts/
    └── insert-mermaid.js
```

## QuickAdd setup

1. Settings → QuickAdd
2. Add Choice: `Insert Mermaid`
3. Type: `Macro`
4. Macro Builder → Add → User Script
5. Select `_scripts/insert-mermaid.js`
6. Enable `Add to command palette`
7. Settings → Hotkeys → bind `QuickAdd: Insert Mermaid`

Suggested shortcut:

`Ctrl/Cmd + Alt + M`

## Notes

- Snippets use `mermaid-next`.
- If Mermaid Next replaces Obsidian's native renderer, you can change fences to `mermaid`.
- ZenUML is omitted because it needs a separate Mermaid extension.
- Some beta diagrams depend on the Mermaid version loaded by Mermaid Next.
