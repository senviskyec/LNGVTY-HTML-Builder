# LNGVTY Hub — Graphics & Newsletter Builder

A single-file, browser-based builder for LNGVTY Hub's marketing emails, promotional graphics, and web pages. Assemble a document from a library of brand-locked components, then export production-ready HTML that renders correctly in real inboxes.

**Live:** https://senviskyec.github.io/LNGVTY-HTML-Builder/
**Author:** Evan Senvisky · **Stakeholder:** Tim Pedersen, LNGVTY Hub (Carrboro, NC)

---

## Table of Contents

- [What this is](#what-this-is)
- [Quick start](#quick-start)
- [The toolbar](#the-toolbar)
- [Building a document](#building-a-document)
- [Saving & loading](#saving--loading)
- [Images](#images)
- [Customization](#customization)
- [Sending an email (GHL)](#sending-an-email-ghl)
- [Repository layout](#repository-layout)
- [Architecture](#architecture)
- [Setup / configuration](#setup--configuration)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Roadmap](#roadmap)

---

## What this is

Before this tool, every newsletter meant hand-editing HTML. Every typo fix was a code change, and every campaign started by copy-pasting the last one. This builder moves that work to the person who owns the content.

**Key properties:**

- **Zero infrastructure.** One static HTML file on GitHub Pages. No server, no build step, no runtime cost.
- **72 brand-locked components** across 12 groups. Off-brand output is difficult to produce by accident.
- **Structured-data persistence.** Documents are saved as versioned JSON, not exported HTML — so they stay fully editable forever, and Git gives you free version history and backups.
- **Email-safe export.** Modern CSS in the editor is deterministically converted to table-based, inline-styled HTML that works in Outlook, Gmail, and Apple Mail.

---

## Quick start

1. Open the [builder](https://senviskyec.github.io/LNGVTY-HTML-Builder/).
2. Click **⚙ GitHub** and paste your personal access token (one-time — see [Setup](#setup--configuration)).
3. Pick a mode from the left dropdown: **Graphics**, **Newsletter**, or **Webpage**.
4. Click sections in the left rail to add them to the canvas.
5. Click any text to edit it. Faded "ghost text" is a suggestion — type to replace it.
6. Click **💾 Save** to store it to GitHub.
7. Click **📋 Copy HTML** and paste it into a GoHighLevel campaign.

---

## The toolbar

Buttons are grouped by what they do.

| Group | Button | What it does |
|---|---|---|
| **Save** | 💾 Save | Saves to this browser **and** to GitHub. Prompts for Name, Tag, Status, Notes. |
| | ⭐ Saved | Browse everything saved to GitHub. Preview, load, or delete. |
| **Output** | 👁 Preview | See the finished email with desktop/mobile toggles. |
| | ↓ Download | Save the finished HTML as a file. |
| **Copy** | 📋 Copy HTML | Copies the finished email HTML. **This is what you paste into GHL.** |
| | 🧪 Copy CSS | Copies the HTML **plus** the structured section JSON, bundled. For testing and moving work between machines. |
| **Build** | 📥 Import | Rebuild a document from section JSON (or a Copy CSS bundle). Sections stay fully editable. |
| | ⟨⟩ View HTML | Read the finished HTML. Click **✎ Edit** to unlock it for last-minute hand-tweaks. |
| | ✚ New Section | Create a custom reusable component by pasting in HTML. |
| **Style** | 🎨 Customize | Global colors, fonts, sizes, and the text clean-up tool. |
| | 📷 Images | Browse the repo's image library, or upload a new image. |
| — | ⚙ GitHub | Connect the repo where documents are stored. One-time setup. |
| | 📖 Docs | The in-app guide. |
| | 🗑 Clear | Wipes the canvas (asks first). |

---

## Building a document

### Modes

The dropdown at the top of the left rail switches between **Graphics**, **Newsletter**, and **Webpage**. They share one component library, so sections are cross-compatible. **Tags** (merge fields) is pinned beside it — click the dropdown again to get back to sections.

### Ghost text

All default copy is a *suggestion*, shown faded. It is **not real content** — if you leave it alone, it does not appear in the exported email. Type over it to make it real.

> **Exception:** numbered step badges (`1`, `2`, `3`) and timeline icons (`✓`, `→`) *do* export, because those numbers are meaningful defaults rather than fill-in prompts.

### Lists

Any section with a list — events, ingredients, steps, tips, swaps, tags, metrics, paragraphs — supports **add**, **delete**, and **reorder**. Hover a row to reveal its controls.

### Per-section themes

Each block has its own **Theme** button that cycles ○ white → ◐ gray → ● black → ◆ orange. This is independent of the global accent color, so you can mix light and dark blocks in one document.

### Links

Every link in every section is editable. Hover the button or link, click the **🔗 link** control, and paste your URL. You never need to touch the code.

> Social links in the footers are **hardcoded** to the real LNGVTY accounts (Facebook, Instagram, Website) — no need to set them each time.

---

## Saving & loading

Documents are stored as JSON files in the repo's `saved/` folder.

- **💾 Save** writes `saved/{slug}.json`. Re-saving with the same **Name** updates that same file — no duplicates. Git keeps the previous version.
- **⭐ Saved** opens the library. It auto-refreshes from GitHub every time you open it, so **Load** always works without a manual reload.
- Each saved item shows a **thumbnail preview** of the top of the document, plus three buttons:
  - **👁 Preview** — look at it *without* loading it, so you don't lose your current work.
  - **📥 Load** — open it for editing. Every section keeps its type and dynamic controls.
  - **🗑 Delete** — removes the file (Git history retains a copy).
- **Tag** and **Status** are stored inside the document, so they survive a cache wipe. The Tag dropdown has a **＋ Add new tag…** option.

---

## Images

Images live in the repo's `images/` folder and are referenced by **URL** — they are *not* embedded in the email, which keeps the payload small and prevents Gmail from clipping the message.

**To use an image:**

1. Click **📷 Images** in the toolbar (or the "Set Photo" button inside a section).
2. Pick one from the grid, or click **↑ Upload New Image** to add one.
3. Uploaded images are committed to `images/` and become available at:

```
https://senviskyec.github.io/LNGVTY-HTML-Builder/images/{filename}
```

Example of the resulting markup:

```html
<img src="https://senviskyec.github.io/LNGVTY-HTML-Builder/images/pickledcucumbersalad.png"
     alt="Pickled Cucumber Salad">
```

Sections with optional photos (Featured Recipe, New Member Welcome) have a **show/hide toggle**. If the toggle is off — or on but no image was picked — the image block is omitted from the export entirely, so a broken image can never ship.

---

## Customization

Click **🎨 Customize**.

### Global colors
Accent, dark background, gray background, page background, body text, heading. These recolor every block at once. Quick accent presets are provided, plus a **Reset Colors** button.

### Typography
Heading font, body font, body size, and line height. Defaults match the LNGVTY brand (Montserrat / Open Sans).

### Text clean-up
**🧹 Reset All Text to Brand Styling.**

Pasting from Word, Google Docs, or a webpage drags in foreign fonts, sizes, and colors as hidden inline styles. This button strips all of that and snaps every text box back to the section's own brand styling — without touching your words.

> **Note:** intentional per-word accent coloring (applied with the text color bar) will also be cleared. Re-apply it afterwards.

---

## Sending an email (GHL)

1. Build and **💾 Save** the document.
2. Click **👁 Preview** and check it — especially on the mobile toggle.
3. Click **📋 Copy HTML**.
4. In GoHighLevel, create a new email campaign or template.
5. Choose the **Custom HTML / Code** block and paste.
6. Send a **test email to yourself first.** The built-in preview is accurate, but a real inbox is the final word.

---

## Repository layout

```
LNGVTY-HTML-Builder/
├── index.html          # the builder — the entire application
├── favicon.ico
├── README.md           # this file
├── saved/              # saved documents (structured JSON)
│   ├── tip-tuesday-week-3.json
│   └── keto-day-7.json
└── images/             # image library (referenced by URL)
    └── pickledcucumbersalad.png
```

---

## Architecture

### The central decision

**Structured section data — not exported HTML — is the source of truth.**

An earlier version stored the finished HTML and re-parsed it to rebuild the editor. This is intuitive and structurally broken. Export is a *lossy* transform: it flattens semantic components into presentational markup, so a "Calendar" and a "Recipe" both become anonymous nested tables. On re-import, the parser cannot recover what the markup *meant*. Every block came back labeled "Imported," and while text stayed editable, all dynamic behavior was gone — the calendar no longer knew it was a calendar, so "Add Event" ceased to exist.

The fix was to invert the relationship. The editor already knows the complete semantic state before export. Persist *that*, and generate HTML on demand. The round trip becomes lossless by construction, and export becomes a pure one-directional rendering step.

> **Principle:** never persist the output of a lossy transform as your source of truth. Persist the input; re-derive the output.

### Data flow

```
SECTION LIBRARY  (72 declarative component definitions)
        │  addSection(key)
        ▼
   LIVE CANVAS   (contenteditable DOM, drag-reorder, per-section themes)
        ├── serializeNewsletter() ──► STRUCTURED JSON ──► GitHub  saved/
        └── buildExport()         ──► EMAIL-SAFE HTML ──► clipboard / GHL
```

### Document schema

```json
{
  "schema":    "lngvty.newsletter/v1",
  "id":        "tip-tuesday-week-3",
  "name":      "Tip Tuesday — Week 3",
  "tag":       "Newsletter",
  "status":    "Draft",
  "notes":     "...",
  "updatedAt": "2026-07-13T...Z",
  "theme":     { "--accent": "#e05a1b", "...": "..." },
  "sections":  [
    { "key": "chHeader", "theme": "dark",  "html": "<...>" },
    { "key": "nlevents", "theme": "white", "html": "<...>" }
  ]
}
```

`key` is the section **type** — this is what preserves semantic identity and is why a calendar reloads as a calendar with its controls intact. `html` is that instance's current content.

Per-section typed schemas (a calendar storing an `events[]` array, etc.) were considered and rejected: they would require a bespoke serializer *and* deserializer for each of 72 types, and any field omitted from either would silently destroy user data on save. The chosen model gets the same benefit with one shared code path.

### Component model

Sections are declarative entries in a single registry:

```js
chOffer: {
  group : 'Offers',
  icon  : '★',
  name  : 'Special Offer / Discount',
  theme : 'dark',        // default per-section theme
  mode  : 'graphics',    // graphics | newsletter | blog
  html  : () => `...`    // markup, composed from helpers
}
```

Markup is assembled from a small set of primitives. **Using these is what gives a new section every platform capability for free:**

| Helper | Gives you |
|---|---|
| `ph(text, style, tag)` | A contenteditable field whose default renders as ghost text and never leaks into export. |
| `listBlock(items, proto, label)` | Add / delete / reorder controls on a list. |
| `realBtn(text, style, href)` | A hyperlink whose destination is editable via a modal. |
| `tagBlock(tags, style)` | Add-removable pill tags. |
| `liMoves()` | Up/down reorder controls on a list row. |

### Email-safe export

Email clients are not browsers. Outlook renders through Word's layout engine — no flexbox, no grid, no CSS custom properties. The export pipeline:

1. Clone the canvas (the editor is never mutated).
2. Strip builder-only chrome (controls, drag handles, list affordances).
3. Resolve ghost text — untouched placeholders are **removed**, not emitted.
4. Resolve CSS custom properties to literal hex.
5. Convert flex layouts to tables.
6. Inline all styles; wrap in a 620px table-based email frame.

**Flex → table** is the hard part, and it produced the most instructive bugs:

- **`align-items: stretch` → `height:100%`.** Flexbox stretches children to equal height implicitly. Tables don't. Without this mapping, colored side-bars rendered only as tall as their own (empty) content, exposing the background through the gap.
- **`flex: 1` → `width:100%`.** A table shrinks to its content unless told otherwise, so white content cards stopped wherever the text ended.
- **Flex containers with no element children** (a numbered step badge centering its own digit) are *not* tableized — that produced a table with no cells and an empty circle. They're centered with `text-align` + `line-height` instead.
- **Tag pills** carry their spacing as an inline `margin`, because the editor's flex `gap` is stripped on export — without it, tags render as one connected orange blob.

For the highest-risk components (schedule and event rows) the flex converter was abandoned entirely in favor of **hand-written table markup**. A heuristic that must be right is a liability; explicit markup that cannot drift is an asset.

### Verification

An automated audit renders all 72 sections through the full export pipeline and asserts:

- no residual `display:flex`
- no builder-only classes survive
- no empty table rows (the signature of a failed conversion)
- no ghost-text prose leaks
- section type identity survives a serialize → apply round trip

This is **not** a substitute for viewing output in a real client. Always send yourself a test email.

---

## Setup / configuration

### GitHub token (one-time)

Writes require a token. Reads from a public repo do not.

1. GitHub → **Settings** → **Developer settings** → **Fine-grained tokens**.
2. Scope it to **only** the `LNGVTY-HTML-Builder` repo.
3. Permissions: **Contents → Read and write**.
4. In the builder, click **⚙ GitHub**, paste the token, click **🔗 Test connection**, then **Save settings**.

Defaults are pre-filled:

| Field | Value |
|---|---|
| Owner | `senviskyec` |
| Repository | `LNGVTY-HTML-Builder` |
| Documents folder | `saved` |
| Images folder | `images` |

> **Security note.** A static page cannot hide a secret, so the token is stored in your browser's `localStorage` on your machine only. This is an accepted trade-off for a private, two-person internal tool. If this is ever exposed more widely, the fix is a small serverless proxy (Cloudflare Worker) holding a server-side token — the client's data model would not need to change.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| **"Found 0 newsletter files in `templates/`"** | Old cached config. Open **⚙ GitHub**, set the folder to `saved`, and save. Fixed in v13.0 — the default is now `saved`. |
| **Saved list is empty / Load does nothing** | Not connected. Open **⚙ GitHub** and add your token. The library auto-refreshes on open. |
| **Can't get out of the Tags pane** | Click the mode dropdown (Graphics / Newsletter / Webpage) — it returns you to sections. |
| **Tags render as one orange blob in email** | Fixed in v13.0. If you see it on an *old* saved doc, re-save it. |
| **Pasted text looks wrong** | **🎨 Customize → 🧹 Reset All Text to Brand Styling.** |
| **Email looks broken in the inbox but fine in preview** | Send a test to yourself and check. If a section is at fault, note which one — the flex→table converter is the usual suspect. |
| **Image doesn't show** | Confirm it's in `images/` and the URL resolves. GitHub Pages can take ~30s to serve a newly uploaded file. |
| **Ghost text appeared in a sent email** | You typed over it, so it became real. Clear the box entirely to omit it. |

---

## Changelog

Dates prior to v12.0 to be backfilled from commit history.

### v13.0 — Toolbar, Images & Customization — *13 July 2026*
- Regrouped the toolbar into labeled clusters (Save/Library · Output · Copy · Build · Style) instead of one undifferentiated row.
- Moved the global theme out of the right-hand rail into a **🎨 Customize** modal; added heading/body **font**, **body size**, and **line height** controls.
- Added **🧹 Reset All Text to Brand Styling** — strips foreign fonts, sizes, and colors dragged in by pasting from Word/Docs/the web.
- Added an **📷 Image Library** backed by the repo's `images/` folder, with thumbnail previews and in-app upload. Section photo pickers (Featured Recipe, New Member Welcome) now pull from it and reference images **by URL** instead of embedding base64.
- Added **thumbnail previews** to every saved document, plus a **👁 Preview** button that renders a saved doc *without* loading it over your current work.
- Fixed tag pills merging into one connected orange bar on export — spacing now rides on each pill as an inline margin, since the editor's flex `gap` is stripped.
- Hardcoded the real Facebook / Instagram / Website URLs into all footers.
- Fixed the GitHub folder default (`templates` → `saved`), which surfaced as "Found 0 files in templates/" on a cleared cache or in incognito.
- Fixed being unable to leave the **Tags** pane — clicking the mode dropdown now returns you to sections.

### v12.0 — Featured Recipe Imagery — *13 July 2026*
- Added an optional, toggleable photo to the Featured Recipe section.
- Export is conditional in both directions: the block is omitted when the toggle is off *and* when it's on but no image was chosen, so an empty image element can never ship.

### v11.0 — Keto Challenge Campaign & Library Expansion
- Authored a four-email drip campaign (days 7, 14, 21, 30), then harvested 18 new components from it into the library (total: 72).
- Distributed the reusable components into their natural groups rather than siloing them.
- Made the saved-document library auto-refresh so Load works without a manual reload.
- Made the View HTML panel editable for last-mile tweaks.

### v10.0 — Interface & Interchange
- Replaced the cramped rail tab strip with a dropdown; pinned Tags separately.
- Consolidated duplicate event sections; added a weekday field under the date.
- Added **Copy CSS** (HTML + structured JSON bundle) and reinstated **Import** on structured JSON.
- Persisted tag/status in the document JSON; made the tag list user-extensible.

### v9.0 — Layout Hardening
- Fixed colored side-blocks not filling row height (`align-items:stretch` unmapped).
- Fixed content cards not spanning row width (`flex-grow` unmapped).
- Fixed numbered step badges exporting as empty circles.
- Rewrote schedule/event components to emit table markup directly.

### v8.0 — GitHub Migration & Structured Data Model
- Retired Airtable and Make; GitHub Contents API became the datastore.
- Removed HTML import entirely, eliminating the "Imported section" bug class at its root.
- Defined the `lngvty.newsletter/v1` schema; unified save/load onto one lossless path.

### v7.0 — Email-Safe Export
- Built the flex→table conversion, style inlining, and CSS-variable resolution pipeline.
- Established the automated structural audit across the full library.

### v6.0 — Persistence (Airtable & Make)
- Saved-graphics library with name/tag/status/notes, via Make webhooks into Airtable.

### v5.0 — Newsletter Mode
- Introduced Graphics / Newsletter / Webpage modes sharing one component library.
- Ported the newsletter components and converted their fixed form fields to ghost text.

### v4.0 — Reordering & Layout Corrections
- Drag reordering; CTA alignment fixes; removable buttons; results-timeline completion toggle.

### v3.0 — Embeds, Links & Custom Sections
- Embed sections (GHL forms, MP4, MP3); editable hrefs everywhere; live preview.
- Custom section builder: paste HTML to create a new reusable component.

### v2.0 — Content Model & Dynamic Sections
- Ghost text; dynamic lists; per-section theming; merge-tag hotkeys; per-character color.

### v1.0 — First Interactive Builder
- Toggleable sections, fixed order, no persistence. Validated the concept.

### Phase 0 — Hand-Edited Templates
- Static HTML edited by hand per campaign. Established the design system.

---

## Roadmap

### Known limitations

| Item | Detail | Severity |
|---|---|---|
| Token in `localStorage` | Accepted for a private two-person tool; a serverless proxy is the fix before any wider exposure. | Accepted |
| No visual regression testing | Correctness is verified structurally, not visually. | Medium |
| Manual list numbering | Reordering a numbered list doesn't renumber its items. | Low |
| View HTML edits are one-way | Manual tweaks don't propagate back to the canvas — by design, since reverse-parsing is the failure mode the architecture exists to avoid. | By design |

### Planned

- [ ] Prebuilt campaign templates (save the four keto emails into `saved/` as one-click starting points)
- [ ] Member testimonial section sourced from challenge feedback forms
- [ ] Google Sheets embed to review form responses in-app
- [ ] Collapsible toolbar; admin notes / bug tracker panel
- [ ] Visual regression suite (render-and-compare across the library)
- [ ] Serverless token proxy (prerequisite for any non-private deployment)

---

## Design system

| Token | Value | Usage |
|---|---|---|
| Accent | `#E05A1B` | CTAs, accent bars, eyebrow headings |
| Dark | `#1A1A1A` | Hero and footer backgrounds |
| Gray | `#3A3A3A` | Headings; secondary dark surfaces |
| Page | `#F2F2F2` | Email page background |
| Tint | `#FAF7F5` | Warm off-white for tinted callout blocks |
| Display type | Montserrat | Headings, labels, buttons (300/400/700/900) |
| Body type | Open Sans | Body copy (300/400) |
| Email width | 620px | Max content width of the email frame |

---

## Suggested commit message

```
feat: toolbar groups, image library, customization panel; fix tag spacing + saved/ default

Toolbar & UI
- Regroup toolbar into labeled clusters (Save/Library, Output, Copy, Build, Style)
- Move global theme out of the right rail into a Customize modal
- Fix: clicking the mode dropdown now exits the Tags pane

Customization
- Add heading/body font, body size, and line-height controls
- Add "Reset All Text to Brand Styling" to strip pasted formatting

Images
- Add image library backed by the repo's images/ folder, with thumbnails + upload
- Section photo pickers now reference images by URL instead of embedding base64

Saved documents
- Add thumbnail previews to saved cards
- Add a Preview button that renders a saved doc without loading it over the canvas

Fixes
- Tag pills merged into one orange bar on export; spacing now rides on each pill
  as an inline margin (the editor's flex `gap` is stripped on export)
- GitHub folder default was `templates`, not `saved` — broke on cleared cache/incognito
- Hardcode real Facebook/Instagram/Website URLs in all footers

Verified: all 72 sections export clean (no residual flex, no leaked chrome,
no empty rows). Storage round trip intact.
```
