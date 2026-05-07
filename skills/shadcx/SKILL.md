---
name: shadcx
description: Build UIs with shadcx self-contained Web Components. Use this skill when the user wants to create web pages, dashboards, forms, or any UI using shadcx components. Covers CDN usage, theming, component APIs, and patterns for composing layouts without a build step.
license: MIT
---

This skill guides the use of shadcx — self-contained Web Components that mirror shadcn/ui but work in any HTML page without frameworks or build tools.

## Philosophy

shadcx components are:
- **Self-contained**: Each component is a single file with its own CSS, HTML template, and JS. No shared imports.
- **Framework-agnostic**: Vanilla `HTMLElement` custom elements. Works in React, Vue, Svelte, or plain HTML.
- **Theme-driven**: All styling comes from CSS custom properties in `theme.css`. Change variables, change the look.
- **CDN-ready**: Use with `<script type="module">` — no bundler needed.
- **Test-gated**: `pnpm build` runs Vitest coverage and fails below 80% global component coverage.

## Quick Start

Load the theme and any components you need:

```html
<link rel="stylesheet" href="https://dobrinyonkov.github.io/shadcx/assets/theme.css">
<script type="module" src="https://dobrinyonkov.github.io/shadcx/assets/button.js"></script>
<script type="module" src="https://dobrinyonkov.github.io/shadcx/assets/input.js"></script>

<shadcx-button>Click me</shadcx-button>
<shadcx-input placeholder="Type here..."></shadcx-input>
```

## Components

### Button
- **Variants**: `default` | `secondary` | `destructive` | `outline` | `ghost` | `link`
- **Sizes**: `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`
- **Attributes**: `variant`, `size`, `disabled`
- **CSS Part**: `::part(root)` for custom overrides

```html
<shadcx-button variant="destructive" size="sm">Delete</shadcx-button>
```

### Input
- **Attributes**: `type`, `placeholder`, `value`, `disabled`, `aria-invalid`
- When `aria-invalid="true"`, shows destructive border and focus ring
- **CSS Part**: `::part(root)`

```html
<shadcx-input placeholder="Email" aria-invalid="true"></shadcx-input>
```

### Badge
- **Variants**: `default` | `secondary` | `destructive` | `outline` | `ghost` | `link`
- **Inline icons**: Add `<svg data-icon="inline-start">` or `<svg data-icon="inline-end">` inside the badge

```html
<shadcx-badge variant="outline">
  <svg data-icon="inline-start" ...></svg>
  Verified
</shadcx-badge>
```

### Checkbox
- **Attributes**: `checked`, `indeterminate`, `disabled`, `aria-invalid`
- **Events**: `input`, `change`, `checked-change` (CustomEvent with `{ checked, indeterminate, state }`)

```html
<shadcx-checkbox checked></shadcx-checkbox>
```

### Combobox
- **Properties**: `.items` (array of strings), `.value` (string), `.values` (array of strings)
- **Attributes**: `multiple`, `show-clear`, `auto-highlight`, `disabled`, `aria-invalid`
- **Keyboard**: Arrow keys to navigate, Enter to select, Escape to close
- **Clear button**: Appears when a value is selected

```html
<script type="module">
  const cb = document.querySelector('shadcx-combobox')
  cb.items = ['React', 'Vue', 'Svelte', 'Angular']
  cb.value = 'React'
</script>
<shadcx-combobox></shadcx-combobox>
```

### Textarea
- **Attributes**: `placeholder`, `value`, `rows`, `disabled`, `required`, `readonly`, `aria-invalid`
- **CSS Part**: `::part(root)`

```html
<shadcx-textarea placeholder="Tell us more..."></shadcx-textarea>
```

### Card
- **Composition**: `shadcx-card`, `shadcx-card-header`, `shadcx-card-title`, `shadcx-card-description`, `shadcx-card-action`, `shadcx-card-content`, `shadcx-card-footer`
- **Attributes**: `size="default" | "sm"`
- **CSS Part**: `::part(root)` on every card element

```html
<shadcx-card>
  <shadcx-card-header>
    <shadcx-card-title>Card Title</shadcx-card-title>
    <shadcx-card-description>Card description</shadcx-card-description>
  </shadcx-card-header>
  <shadcx-card-content>Card content</shadcx-card-content>
  <shadcx-card-footer>Card footer</shadcx-card-footer>
</shadcx-card>
```

### Dropdown Menu
- **Composition**: `shadcx-dropdown-menu`, `shadcx-dropdown-menu-trigger`, `shadcx-dropdown-menu-content`, `shadcx-dropdown-menu-item`, labels, groups, separators, checkbox/radio items, shortcuts, and submenus
- **Attributes**: root `open`, content `align="start" | "end"`, item `variant="default" | "destructive"`, item `disabled`
- **Events**: `checked-change` on checkbox items, `value-change` on radio groups
- **Keyboard**: trigger opens with Enter, Space, ArrowDown, or ArrowUp; menu items support ArrowUp, ArrowDown, Home, End, and Escape dismissal
- **Placement**: main menus flip top/bottom and submenus flip left/right based on available viewport space

```html
<shadcx-dropdown-menu>
  <shadcx-dropdown-menu-trigger>
    <shadcx-button variant="outline">Open</shadcx-button>
  </shadcx-dropdown-menu-trigger>
  <shadcx-dropdown-menu-content>
    <shadcx-dropdown-menu-item>Profile</shadcx-dropdown-menu-item>
    <shadcx-dropdown-menu-item>Billing</shadcx-dropdown-menu-item>
  </shadcx-dropdown-menu-content>
</shadcx-dropdown-menu>
```

## Theming

The `theme.css` file defines CSS custom properties under `:root` and `.dark`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --radius: 0.5rem;
  /* ... */
}
```

Colors are in HSL format: `hue saturation% lightness%`. Use `hsl(var(--primary))` in your own CSS.

Override variables to retheme:

```html
<style>
  :root {
    --primary: 263 70% 50%;
    --radius: 0.75rem;
  }
</style>
```

### Theme Generator

The docs app includes a Theme Generator at `/#/theme-generator`. It previews real shadcx components in a horizontally scrollable card grid and exports CSS variables. In dark mode, base color palettes do not override dark foreground, border, muted, input, and background tokens, so shuffled themes stay readable.

## Layout Patterns

### Form field with label

```html
<div style="display:grid;gap:0.375rem">
  <label style="font-size:0.875rem;font-weight:500">Email</label>
  <shadcx-input placeholder="you@example.com"></shadcx-input>
  <small style="font-size:0.8125rem;color:hsl(var(--muted-foreground))">We won't spam you.</small>
</div>
```

### Card layout

```html
<shadcx-card>
  <shadcx-card-header>
    <shadcx-card-title>Card Title</shadcx-card-title>
    <shadcx-card-description>Card content here.</shadcx-card-description>
  </shadcx-card-header>
</shadcx-card>
```

### Horizontal button row

```html
<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">
  <shadcx-button>Primary</shadcx-button>
  <shadcx-button variant="secondary">Secondary</shadcx-button>
  <shadcx-button variant="outline">Cancel</shadcx-button>
</div>
```

## Advanced

### Customizing a component instance

Use `::part(root)` to override a single instance:

```html
<style>
  shadcx-badge.success::part(root) {
    background-color: hsl(142 71% 45% / 0.15);
    border-color: hsl(142 71% 45% / 0.35);
    color: hsl(142 84% 25%);
  }
</style>
<shadcx-badge class="success">Success</shadcx-badge>
```

### Dark mode

Toggle `.dark` on `<html>` and set `color-scheme: dark`:

```html
<html class="dark" style="color-scheme:dark">
```

The `theme.css` file provides `.dark` overrides for all variables.

### Self-hosting

Download `theme.css` and individual `.js` files from the GitHub releases or build from source. No npm install needed for consumers.

### Testing and Coverage

```bash
pnpm test
pnpm build
```

`pnpm build` runs `tsc && vitest run --coverage && vite build`. Coverage includes `src/lib/*.ts`, excludes `src/lib/*.test.ts`, and enforces 80% thresholds for statements, branches, functions, and lines.

## Rules

- Always load `theme.css` before component scripts.
- Components self-register on import. Do not manually call `customElements.define`.
- Use `shadcx-*` tag names as shown — custom element names are fixed.
- Prefer real shadcx components over inline HTML/CSS when a component exists.
- For missing primitives (Select, Dialog, Tabs, Table, Alert, Separator), compose with HTML + CSS using the theme variables, or inline a custom element. Mark with a comment `<!-- replace with shadcx X -->` for future migration.
