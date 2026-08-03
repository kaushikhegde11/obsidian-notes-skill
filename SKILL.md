---
name: obsidian-notes-skill
description: Create, convert, or reformat notes in the user's Obsidian vault to match THEIR OWN structure. The skill learns each vault once through a setup wizard and saves the layout (folder roles, tag style, date format, promotion style) to vault-config.yaml. Use whenever the user asks to make an "obsidian note", "main note", "atomic note", "zettelkasten note", "source note", "convert this to my structure", "add to my vault", "file this in obsidian", clean up a note's frontmatter/tags, or set up / change how notes are filed. Also trigger when the user pastes rough content and asks to file it into Obsidian, or points at a note in the vault and asks to normalize/restructure it. Works with any vault layout — Zettelkasten, PARA, flat, or custom.
---

# Obsidian Notes

File and format notes into the user's Obsidian vault. Every vault is different, so this skill **does not assume a fixed layout**. It reads the user's structure from a config file and follows it. It learns that structure once, through a setup wizard, then reuses it.

The Zettelkasten ideas below (atomic notes, own words, interlinking) are **guidance**, not requirements. A user's config decides the actual folders and conventions.

## Step 1 — Load config or run setup (always first)

Read `vault-config.yaml` in this skill's own folder (next to `SKILL.md`).

- If the file exists and has a `vault_root` and a `folders` block → **load it**. Use its values for everything below. Do not run the wizard.
- If the file is missing or incomplete → **run the Setup wizard** (next section), write the file, then continue.

`vault-config.example.yaml` (same folder) documents every field. Never invent a structure. Read it from config or ask.

## Step 2 — Setup wizard (only when config is missing)

Goal: learn this vault and write `vault-config.yaml`. Ask with the `AskUserQuestion` tool. Write each question in Simplified Technical English. Obey the four-button limit (below).

1. **Vault root.** Ask for the absolute path to the vault. Then scan its top-level folders with a read-only `ls`/`find`. Keep the real folder names for the next questions.
2. **Preset.** Ask: "Which layout matches your vault?" Buttons: `Zettelkasten`, `PARA`, `Flat (no folders)`, `Custom`. The preset pre-fills the role map. The user adjusts it next.
3. **Map roles to folders.** For each role, ask which scanned folder holds it. Roles: `rough`, `source`, `main`, `tags`, `templates`, `indexes`. Allow "none / not used". For a flat vault, set the role to `""` so notes land in the vault root.
4. **Source subfolders.** If a `source` folder exists, ask which subfolders it uses (multi-select of the scanned subfolders). `[]` if none.
5. **Tag style.** Ask: "How do you tag notes?" Buttons: `wikilink notes ([[tag]])`, `#hashtags`, `YAML frontmatter`, `none`.
6. **Date format.** Ask: "Which date do you put on a note?" Buttons: `DD-MM-YYYY`, `YYYY-MM-DD`, `DD-Mon-YYYY`, `none`.
7. **Promotion.** Ask: "May a source topic become its own main note?" If yes, ask the link style: `## [[heading]]` or `- [[bullet]]`.

Write the answers to `vault-config.yaml` using the schema in `vault-config.example.yaml`. Then tell the user the setup is saved and continue with the note they asked for.

## The four-button limit
The tool shows four buttons for each question. A vault has more folders and tags than four. Use these rules:
- Keep the question to one short sentence.
- Do not list every item in the question.
- Show the four most likely items as buttons.
- Add an "Other" option. "Other" accepts an item that is not shown, a new tag, or a new folder.
- If the user needs the full list, show it once before you ask. Do not put the list in the question.

Good question: "Which tags apply to this note?"
Bad question: "Which tags apply? Full list is 33 (AI, coding, ux, portfolio …). Pick or add via Other."

## Config values used below
Read these from `vault-config.yaml`. The names in `<…>` refer to config fields.
- `<VAULT_ROOT>` = `vault_root`.
- Role folders = `folders.rough`, `folders.source`, `folders.main`, `folders.tags`, `folders.templates`, `folders.indexes`. A null/`""` role → use `folders.default` (which is `""` for a flat vault = the vault root).
- `<TAG_STYLE>` = `tags.style`; `<DATE>` = `date.format` / `date.position`; `<PROMO>` = `promotion.enabled` + `promotion.link_style`; `<TITLE>` = `wrapper.title`; `<REF>` = `wrapper.reference_heading`.

## Note wrapper (built from config)
A finished note looks like this, with each part driven by config:
```
<date in date.format, if date.position = top>

<tags, rendered in tags.style>

# Title                     (wrapper.title = h1)

<body>

<wrapper.reference_heading, if set>
<links>
```
Rendering rules:
- **Date** — format per `date.format`. If `date.position = frontmatter`, put it in YAML instead of a top line. If `none`, omit.
- **Tags** — render per `tags.style`:
  - `wikilink-stub` → a `Tags: [[a]], [[b]]` line. Create an empty `[[tag]]` note in `folders.tags` for any missing tag (only when `create_stub: true`).
  - `hashtag` → a line of `#a #b`.
  - `yaml` → a YAML `tags: [a, b]` block at the top.
  - `none` → omit tags.
  - Keep the count within `tags.min`..`tags.max`. Warn if it goes over.
- **Reference** — add `wrapper.reference_heading` and the links only if the field is set.

## Required intake (ask every time, before you write)
Use `AskUserQuestion`. Do not create a note before you have the answers. Write every question in Simplified Technical English. Build option lists from the live vault (scan the configured folders at ask time), not from memory.

### Step 0 — Note type
Ask: "Which section does this note go in?" Show one button per role that has a folder in config (for example rough, source, main). A flat vault may offer just "note".
- rough → **Path C**.
- source → **Path A**.
- main → **Path B**.

### Path A — Source note
The source note is the container. You file it first. Later you may promote topics to their own main notes.
1. **Title.** Ask: "What is the title of this source note?" Free text → title.
2. **Tags.** Ask: "Which tags apply to this source note?" Multi-select. Render per `<TAG_STYLE>`.
3. **Subfolder.** If `source_subfolders` is non-empty, ask: "Which subfolder does this note go in?" Options from `source_subfolders`, plus "Other" for a new one. File the note at `<folders.source>/<subfolder>/<Title>.md`. If the list is empty, file at `<folders.source>/<Title>.md` (or `folders.default` if `source` is unset).
4. **Promotion.** Only if `promotion.enabled`. Split the content into topics. Ask: "Which topics need their own main note?" For each promoted topic, ask its own title and tags.

Build the notes:
- Source body — one `## ` heading per topic.
  - Promoted topic → render the heading in `promotion.link_style`: heading style `## [[Topic]]` (no inline body), or bullet style `## Topic` with a `- [[Topic]]` link. The detail lives on the main note.
  - Not promoted → `## Topic` with the content as bullets below it.
- Each promoted topic → a new note in `<folders.main>` with the full wrapper. In the reference section, link back to the source note.

### Path B — Main note (own knowledge, not from a source)
1. **Title.** Ask: "What is the title of this note?" Free text → title.
2. **Tags.** Ask: "Which tags apply to this note?" Multi-select. Render per `<TAG_STYLE>`.
3. **Source links.** If a `source` folder exists, ask: "Which source material links to this note?" Multi-select. Add each to the reference section.
4. **Sub-references.** If `promotion.enabled`, ask: "Does a topic need its own main note?" For each picked topic, create a new main note and link it from this note.

File the note in `<folders.main>` (or `folders.default`).

### Path C — Rough note
A rough note is a scratch buffer. Keep it light.
1. **Title.** Ask: "What is the title of this rough note?" Free text.
2. Write the content under the title. Do not force tags, sections, or a reference section.
3. File the note in `<folders.rough>` (or `folders.default`).
4. Skip promotion and source links.

### Intake rules (all paths)
- Keep tags within `tags.min`..`tags.max`. Warn if the count goes over the max.
- Do not guess a title, a tag, a folder, or a source. Ask.

## Conversion procedure (after the intake)
1. **Strip foreign wrappers** — remove any frontmatter or tag lines that do not match `<TAG_STYLE>`, plus plugin metadata.
2. **Add the wrapper** — date, tags, and title per the config rules above.
3. **Write the body** — Path A: `## ` sections. Path B: an atomic note. Keep existing content verbatim unless the user asks for a rewrite.
4. **Add the reference section** — only if `wrapper.reference_heading` is set.
5. **Create tag stubs** — only when `tags.style = wikilink-stub` and `create_stub = true`.
6. **Interlink** — link a source note to each promoted main note, and link each main note back. Both links must resolve.
7. **Place the files** — use the configured role folders. A null role uses `folders.default`.

## Notes
- `reference/obsidian-structure.md` describes the Zettelkasten preset. It is one preset among several, not the required layout.
- When unsure which folder, tag, or convention applies, read `vault-config.yaml`. If it is still unclear, ask. Do not assume.
