# LNGVTY Builder

A browser-based visual builder that lets a non-technical operator assemble marketing emails, promotional graphics, and web pages from a library of brand-locked components — and export HTML that actually renders in a real inbox.

It is one static HTML file. No server, no build step, no dependencies, no runtime cost.

**Live:** https://senviskyec.github.io/LNGVTY-HTML-Builder/

---

## The problem

LNGVTY Hub is a fitness and wellness gym that ships a weekly newsletter and a steady stream of campaign graphics. Before this tool existed, every one of them was a hand-edited HTML file. Fixing a typo was a code change. Starting a new campaign meant duplicating the last one and carefully deleting the parts that no longer applied.

That is a common failure mode for small-business marketing: the person who owns the *content* and the person who owns the *implementation* are different people, so the two are permanently coupled. The real cost isn't developer hours — it's latency. Content sits in a queue waiting for someone to paste it into markup.

The goal was to decouple them without giving up design consistency or email-client compatibility.

---

## What it does

- **72 brand-locked components** across 12 groups. The design system is enforced by construction, so producing something off-brand takes deliberate effort.
- **Three modes** — Newsletter, Graphics, and Webpage — sharing one component library and one canvas.
- **Ghost text.** Every default is a visible *suggestion* that never leaks into the export unless someone types over it. An untouched placeholder simply isn't emitted.
- **Dynamic everything.** Lists add, delete, and reorder. Links are editable through a modal. Photos come from an image library. Per-section themes cycle independently of the global palette.
- **Email-safe export.** Modern CSS in the editor is deterministically converted to table-based, inline-styled HTML that survives Outlook, Gmail, and Apple Mail.
- **Git-backed persistence.** Documents are versioned JSON files in the repo. Save history and backups come free with Git.

---

## Architecture

### The decision the whole system rests on

**Structured section data — not exported HTML — is the source of truth.**

An earlier iteration stored the finished HTML and reconstructed the editor by parsing it back. This is the intuitive design, and it is structurally broken. Understanding *why* is the core insight of the project.

Export is a **lossy transform**. It flattens semantic components into presentational markup: a "Calendar" and a "Recipe" both become anonymous nested tables. On re-import, the parser cannot recover what the markup *meant*. Every block came back labeled "Imported" — text was still editable, but all dynamic behavior was gone. The calendar no longer knew it was a calendar, so "Add Event" ceased to exist.

The fix was to invert the relationship. The editor already knows the complete semantic state of a document *before* export. Persist **that**, and generate HTML on demand from it. The round trip becomes lossless by construction, and export becomes a pure, one-directional rendering step.

> **Principle:** never persist the output of a lossy transform as your source of truth. Persist the input; re-derive the output.

### Data flow

```
SECTION LIBRARY  (72 declarative component definitions)
        │  addSection(key)
        ▼
   LIVE CANVAS   (contenteditable DOM · drag-reorder · per-section themes)
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
  "updatedAt": "2026-07-13T…Z",
  "theme":     { "--accent": "#e05a1b", "…": "…" },
  "sections":  [
    { "key": "nlheader", "theme": "dark",  "html": "<…>" },
    { "key": "nlevents", "theme": "white", "html": "<…>" }
  ]
}
```

`key` is the section **type**. It is what preserves semantic identity — the reason a calendar reloads as a calendar with its controls intact rather than as an anonymous block. `html` is that instance's current content.

**Why not typed per-section schemas?** A calendar storing an `events[]` array, a recipe storing `ingredients[]`, and so on, was considered and rejected. It would require writing and maintaining a bespoke serializer *and* deserializer for each of 72 component types. Every new component would need two more functions, and any field omitted from either would silently destroy user data on save — a failure mode that is both invisible and expensive. The chosen model achieves the same guarantees through a single shared code path.

### Component model

Sections are declarative entries in one registry:

```js
chOffer: {
  group : 'Offers',
  name  : 'Special Offer / Discount',
  theme : 'dark',        // default per-section theme
  mode  : 'graphics',    // graphics | newsletter | blog | both
  html  : () => `…`      // markup, composed from helpers
}
```

Markup is assembled from a small set of primitives. **Using them is what gives a new section every platform capability for free:**

| Helper | Gives you |
|---|---|
| `ph(text, style, tag)` | A contenteditable field whose default renders as ghost text and never leaks into export. |
| `listBlock(items, proto, label)` | Add / delete / reorder controls on a list. |
| `realBtn(text, style, href)` | A hyperlink whose destination is editable through a modal. |
| `tagBlock(tags, style)` | Add-removable pill tags. |

The consequence is that adding a component is a purely declarative act. The marginal cost of the 73rd section is close to zero.

### The export pipeline

Email clients are not browsers. Outlook renders HTML through Microsoft Word's layout engine. Flexbox, grid, and CSS custom properties are unavailable. Layout that is trivially correct in Chrome can collapse entirely in a real inbox.

The pipeline clones the canvas, strips builder-only chrome, drops untouched ghost text, resolves CSS variables to literal hex, converts flex layouts to tables, inlines every style, and wraps the result in a 620px table frame.

**Flex-to-table is the hard part**, and it produced the most instructive bugs in the project. Flexbox provides behaviors *implicitly* that tables do not:

- `align-items: stretch` makes children equal height. Tables don't inherit that, so colored side-bars rendered only as tall as their own empty content — exposing the background through the gap. Mapped to `height:100%`.
- `flex: 1` grows a child to fill the row. A table shrinks to its content unless told otherwise, so white cards stopped wherever the text ended. Mapped to `width:100%`.
- A flex container with **no element children** — a numbered badge centering its own digit — must *not* be tableized at all. Doing so produced a table with no cells: an orange circle containing nothing.

For the highest-risk components (schedule and event rows), the converter was abandoned in favor of hand-written table markup.

> **Lesson:** when a general-purpose transform repeatedly fails on a specific high-value case, stop hardening the transform and special-case the input. A heuristic that *must* be right is a liability; explicit markup that cannot drift is an asset.

---

## Verification

Correctness here is ultimately *visual*, and the development environment cannot render pixels. So the system is verified structurally, with an automated audit that runs the **entire** library through the full export pipeline on every change and asserts:

- no residual `display:flex` anywhere in the output
- no builder-only classes survive export
- no empty table rows — the signature of a failed component conversion
- no ghost-text prose leaks into the output
- section type identity survives a `serialize → apply` round trip
- **every `onclick` in the DOM resolves to a real function**

That last check exists for a reason. A brace-matching refactor twice silently deleted functions adjacent to its target, breaking Import and GitHub settings with no syntax error to reveal it. The assertion is what caught both incidents, and it is now permanent.

None of this substitutes for sending yourself a test email. That is stated in the in-app docs too.

---

## Repository layout

```
LNGVTY-HTML-Builder/
├── index.html          # the builder — the entire application
├── favicon.ico
├── README.md           # this file
├── saved/              # saved documents (structured JSON)
└── images/             # image library (referenced by URL, not embedded)
```

Full release history, technical notes, and known limitations live **inside the app**, under **Settings → Version & Notes**. They're editable in Markdown from there, which keeps the documentation next to the thing it documents rather than drifting out of sync in a separate file.

---

## Setup

Reads from a public repo need nothing. **Writes require a GitHub token.**

1. GitHub → Settings → Developer settings → **Fine-grained tokens**
2. Scope it to **only** the `LNGVTY-HTML-Builder` repo
3. Permissions: **Contents → Read and write**
4. In the builder: **Settings → GitHub**, paste the token, **Test connection**, **Save**

Owner, repo, and folders are pre-filled.

> **Security note.** A static page cannot hide a secret, so the token lives in `localStorage` on the operator's machine. This is an accepted trade-off for a private, two-person internal tool on a private repo. If the deployment ever widens, the fix is a minimal serverless proxy (a Cloudflare Worker or equivalent) holding a server-side token — the client's data model would not need to change.

---

## Honest assessment

This started as "an HTML page." It is now a visual editor, a component system, a persistence layer with version control, a template library, a document interchange format, and a deployment target. That is a web application.

It remains a static file for sound reasons: zero infrastructure, zero cost, zero operational burden, and a deployment story that fits on one line. But the constraints are visible at the edges. The token-storage compromise, the absence of multi-user coordination, and the lack of an asset pipeline all trace to the same root cause — **there is no server.**

If the scope widens further — image assets, concurrent editors, analytics, richer version management — the migration path is already clear, and that is not an accident:

- The section library and export pipeline are **pure functions of their inputs**. They would port to a backend essentially unchanged.
- The structured JSON schema is already the interchange format a server would use. **No data migration would be required.**
- A minimal serverless layer resolves the token exposure without touching the client's data model.

That the hardest parts of the system are already portable is a consequence of having kept them free of side effects. It's the reason a future migration would be an incremental step rather than a rewrite.

---

**Author:** Evan Senvisky · **Stakeholder:** Tim Pedersen, LNGVTY Hub (Carrboro, NC)
