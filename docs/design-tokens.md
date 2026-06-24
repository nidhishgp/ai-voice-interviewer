# Design Tokens

Source of truth for the AI Voice Interviewer design system.
`apps/web/app/globals.css` implements these as CSS custom properties.
`apps/web/tailwind.config.ts` maps them to Tailwind utility classes.

---

## Design Preference

Light theme: near-black primary on off-white (not pure white) background.
Dark theme: off-white (warm gray) primary on near-black background.
Reference: shadcn.com default — Zinc scale.

## Brand Color Palette

Raw palette — never use these directly in components. Map through semantic tokens below.

| Name        | Hex       | Use                          |
|-------------|-----------|------------------------------|
| zinc-50     | `#fafafa` | Page background (light)      |
| zinc-100    | `#f4f4f5` | Muted surface (light)        |
| zinc-200    | `#e4e4e7` | Border (light)               |
| zinc-400    | `#a1a1aa` | Muted text                   |
| zinc-500    | `#71717a` | Secondary text               |
| zinc-800    | `#27272a` | Card surface (dark)          |
| zinc-900    | `#18181b` | Page background (dark)       |
| zinc-950    | `#09090b` | Deepest dark surface / Primary action (light) |
| zinc-50     | `#fafafa` | Page background (light) / Primary action (dark) |
| red-500     | `#ef4444` | Destructive action (light)   |
| red-900     | `#7f1d1d` | Destructive surface (dark)   |

---

## Semantic Color Tokens

Stored as HSL channels in CSS variables (no `hsl()` wrapper — required for Tailwind opacity modifiers).

### Light Theme (`:root`)

| Token                      | HSL Value         | Tailwind class                  | Purpose                        |
|----------------------------|-------------------|---------------------------------|--------------------------------|
| `--background`             | `0 0% 98%`        | `bg-background`                 | Off-white page background      |
| `--foreground`             | `240 10% 3.9%`    | `text-foreground`               | Near-black default text        |
| `--card`                   | `0 0% 100%`       | `bg-card`                       | Pure white card surface        |
| `--card-foreground`        | `240 10% 3.9%`    | `text-card-foreground`          | Text on card                   |
| `--primary`                | `240 5.9% 10%`    | `bg-primary`                    | Near-black primary action      |
| `--primary-foreground`     | `0 0% 98%`        | `text-primary-foreground`       | Off-white text on primary      |
| `--secondary`              | `240 4.8% 95.9%`  | `bg-secondary`                  | Light gray secondary surface   |
| `--secondary-foreground`   | `240 5.9% 10%`    | `text-secondary-foreground`     | Text on secondary              |
| `--muted`                  | `240 4.8% 95.9%`  | `bg-muted`                      | Muted / disabled surface       |
| `--muted-foreground`       | `240 3.8% 46.1%`  | `text-muted-foreground`         | Gray helper text               |
| `--accent`                 | `240 4.8% 95.9%`  | `bg-accent`                     | Hover highlight                |
| `--accent-foreground`      | `240 5.9% 10%`    | `text-accent-foreground`        | Text on accent                 |
| `--destructive`            | `0 84.2% 60.2%`   | `bg-destructive`                | Delete / danger actions        |
| `--destructive-foreground` | `0 0% 98%`        | `text-destructive-foreground`   | Text on destructive            |
| `--border`                 | `240 5.9% 90%`    | `border-border`                 | Default border                 |
| `--input`                  | `240 5.9% 90%`    | `border-input`                  | Form input border              |
| `--ring`                   | `240 5.9% 10%`    | `ring-ring`                     | Focus ring (matches primary)   |

### Dark Theme (`.dark`)

| Token                      | HSL Value         | Notes                              |
|----------------------------|-------------------|------------------------------------|
| `--background`             | `240 10% 3.9%`    | Near-black (zinc-950)              |
| `--foreground`             | `0 0% 98%`        | Off-white text                     |
| `--card`                   | `240 10% 6%`      | Slightly lighter than background   |
| `--card-foreground`        | `0 0% 98%`        |                                    |
| `--primary`                | `0 0% 98%`        | Off-white primary action           |
| `--primary-foreground`     | `240 5.9% 10%`    | Near-black text on primary         |
| `--secondary`              | `240 3.7% 15.9%`  | Dark gray secondary surface        |
| `--secondary-foreground`   | `0 0% 98%`        |                                    |
| `--muted`                  | `240 3.7% 15.9%`  |                                    |
| `--muted-foreground`       | `240 5% 64.9%`    | Medium gray                        |
| `--accent`                 | `240 3.7% 15.9%`  |                                    |
| `--accent-foreground`      | `0 0% 98%`        |                                    |
| `--destructive`            | `0 62.8% 30.6%`   | Darker red for dark bg             |
| `--destructive-foreground` | `0 0% 98%`        |                                    |
| `--border`                 | `240 3.7% 15.9%`  |                                    |
| `--input`                  | `240 3.7% 15.9%`  |                                    |
| `--ring`                   | `0 0% 98%`        | Matches dark primary               |

---

## Typography Scale

Font families set via `next/font` (Geist) — loaded in `apps/web/app/layout.tsx`.

| Token              | Value                                        |
|--------------------|----------------------------------------------|
| `--font-sans`      | Geist Sans (variable font)                   |
| `--font-mono`      | Geist Mono (variable font)                   |

| Scale  | Size     | Line Height | Weight  | Usage                        |
|--------|----------|-------------|---------|------------------------------|
| `4xl`  | 2.25rem  | 2.5rem      | 700     | Hero headings                |
| `3xl`  | 1.875rem | 2.25rem     | 700     | Page titles                  |
| `2xl`  | 1.5rem   | 2rem        | 600     | Section headings             |
| `xl`   | 1.25rem  | 1.75rem     | 600     | Card headings                |
| `lg`   | 1.125rem | 1.75rem     | 500     | Sub-headings                 |
| `base` | 1rem     | 1.5rem      | 400     | Body text (default)          |
| `sm`   | 0.875rem | 1.25rem     | 400     | Secondary / helper text      |
| `xs`   | 0.75rem  | 1rem        | 400     | Labels, badges, captions     |

---

## Spacing Scale

Tailwind default spacing scale (4px base unit). Semantic aliases for consistency:

| Alias     | Value  | Usage                              |
|-----------|--------|------------------------------------|
| page-x    | 1.5rem | Horizontal page padding (mobile)   |
| page-x-lg | 2rem   | Horizontal page padding (desktop)  |
| section   | 3rem   | Vertical section gap               |
| card      | 1.5rem | Card internal padding              |
| gap-sm    | 0.5rem | Tight component gaps               |
| gap-md    | 1rem   | Standard component gaps            |
| gap-lg    | 1.5rem | Loose component gaps               |

---

## Border Radius

| Token      | Value    | CSS variable    | Usage                   |
|------------|----------|-----------------|-------------------------|
| `--radius` | `0.5rem` | `rounded-[var(--radius)]` | Default (shadcn base) |
| sm         | `0.25rem`| derived         | Badges, tags            |
| md         | `0.5rem` | derived         | Buttons, inputs         |
| lg         | `0.75rem`| derived         | Cards, modals           |
| full       | `9999px` | —               | Avatars, pills          |

---

## shadcn/ui Integration Notes

- Run `npx shadcn init` in `apps/web/` when scaffolding the web app
- Style: **default** (not "new-york")
- CSS variables: **yes**
- Base color: **Zinc** (matches token palette above)
- Components live at `apps/web/components/ui/` — committed to repo, not gitignored
- Upgrade path: `npx shadcn diff <component>` to see upstream changes vs local edits
