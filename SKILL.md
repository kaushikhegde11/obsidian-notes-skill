---
name: obsidian-notes-skill
description: Create, convert, or reformat notes in the user's Obsidian vault to match their minimalist Zettelkasten structure (6 folders, Main Note template, [[wikilink]] tag stubs). Use whenever the user asks to make an "obsidian note", "main note", "convert this to my structure", "add to my vault", "format for obsidian", "atomic note", "zettelkasten note", clean up a note's frontmatter/tags, or create tag/index/source-material notes. Also trigger when the user pastes rough content and asks to file it into Obsidian, or points at a note in the vault and asks to normalize/restructure it. The vault path is set by the user (see README).
---

# Obsidian Zettelkasten Notes

Format and file notes into the user's Obsidian vault following their **minimalist, "bullshit-free" Zettelkasten** system. The system favors the writing process over plugins. Full description in `reference/obsidian-structure.md`.

**Vault root:** `<VAULT_ROOT>` — set this to your Obsidian vault path (see README).

## The six folders

| Folder | Role |
|--------|------|
| `1. Rough Notes` | Temporary staging — ideas, reminders, habit tracking. Optional buffer. |
| `2. Source Material` | Insights from books/videos/articles/podcasts. Subfolders by media type (Books, Articles, Websites…). Active notes stay unsorted at the bottom; move into a subfolder once done. Include source title, page numbers, quotes, **and an expansion in the user's own words**. |
| `3. Tags` | Tags-as-empty-notes. See tag rules below. |
| `4. Template` | `Full Note.md` — the Main Note template. |
| `5. Indexes` | Evolved tags. When a tag note accrues ~50+ links, fill it with subheadings + organized links (a table of contents for a topic). |
| `6. Main Notes` | The workhorse. All permanent atomic notes, **single flat folder, no subfolders**. |

## Main Note template (the target structure)

Every Main Note in `6. Main Notes/` looks exactly like this:

```
DD-MM-YYYY

Tags: [[tag1]], [[tag2]]

# Title

<body — mini-essay / atomic idea, interlinked with other notes>

# Reference
[[Related Main Note]]
[[Source Material note]]
<or external URL / markdown link>
```

Rules:
- **Line 1** — date, plain text, no heading. Format `DD-MM-YYYY` (e.g. `04-08-2026`). The vault also contains `DD-Mon-YYYY` (e.g. `25-Dec-2024`); match the note being edited, otherwise default to `DD-MM-YYYY`.
- **Tags line** — literal `Tags: ` followed by `[[wikilink]]` tags, comma-separated.
- **Title** — a single H1 (`# `).
- **Body** — one idea per note, self-contained, ideally under 500 words, heavily interlinked. (When converting existing long notes, preserve the body verbatim — only fix the wrapper unless asked to rewrite.)
- **Reference** — trailing H1 `# Reference` linking back to Source Material and related Main Notes.

## Tag rules (critical — this is NOT hashtags or YAML)

- A tag is an **empty note** in `3. Tags/`. You "tag" by linking it: `[[Humility]]`.
- **Never** use `#hashtags` or YAML `tags:` frontmatter — those are foreign to this vault and must be stripped on conversion.
- Keep **1–5 tags per note**.
- Tags are **specific personal interests**, not vague buckets. Prefer `[[Deliberate practice]]` over `[[Self-improvement]]`.
- If a tag note doesn't exist yet in `3. Tags/`, **create it as an empty `.md` stub** so the link resolves.

## Required intake (ask every time, before you write anything)

Use the `AskUserQuestion` tool. Do not create a note before you get the answers. Write every question in Simplified Technical English.

Build the option lists from the live vault at the moment you ask:
- For tags, read the folder `3. Tags/`. Each file name is a tag option.
- For source material, read `2. Source Material/` and its subfolders. Each note is an option.
- For a media subfolder, list the subfolders of `2. Source Material/` (example subfolders: `Books`, `Articles`, `Videos`, `Websites` — adjust to your vault).

### The four-button limit
The tool shows four buttons for each question. The vault has more tags, sources, and subfolders than four. Use these rules:
- Keep the question to one short sentence.
- Do not list every item in the question.
- Show the four most likely items as buttons.
- Add an "Other" option. "Other" accepts an item that is not shown. "Other" also accepts a new tag or a new subfolder.
- If the user needs the full list, show it once before you ask. Do not put the list in the question.

Good question: "Which tags apply to this note?"
Bad question: "Which tags apply? Full list is 33 (AI, coding, ux, portfolio …). Pick or add via Other."

### Step 0 — Note type (always first)
Ask: "Which section does this note go in?" Give three buttons: rough notes, source material, main note.
- Answer "rough notes" → run **Path C**.
- Answer "source material" → run **Path A**.
- Answer "main note" → run **Path B**.

### Path A — Source Material note (file the source first)
The source note is the container. You take the notes into it first. Later you promote some topics to their own main page.

1. **Title.** Ask: "What is the title of this source note?" Free text. Use it as the H1.
2. **Tags.** Ask: "Which tags apply to this source note?" Multi-select from `3. Tags/`, "Other" adds a new tag. Create an empty stub for each new tag.
3. **Media subfolder.** Ask: "Which media subfolder does this note go in?" Single-select `Books / Articles / Videos / Websites / AI Source`. "Other" makes a new subfolder. File the note at `2. Source Material/<subfolder>/<Title>.md`.
4. **Promotion.** Split the content into topics (`## ` sections). Ask: "Which topics need their own main page?" Multi-select the topic list. For each topic the user picks, ask its own title and its own tags (Step 1 and Step 2 apply to each promoted main note too).

Then build the notes:
- **Source note body** — one `## ` heading per topic.
  - Promoted topic → write the heading as `## [[Topic title]]` and leave no inline body under it. The detail lives on the main page.
  - Not promoted → write `## Topic` and keep the content under it as bullet points.
- **For each promoted topic** — create `6. Main Notes/<Topic title>.md` with the full Main Note wrapper (date / `Tags:` / `# Title` / body / `# Reference`). Put the expanded content in the body. In `# Reference`, link back to the source note: `[[<source note title>]]`.
- The source note gets the same wrapper: date / `Tags:` / `# Title` / the `## ` sections / trailing `# Reference`.

### Path B — Standalone Main Note (your own knowledge, not from a source)
1. **Title.** Ask: "What is the title of this note?" Free text → H1.
2. **Tags.** Ask: "Which tags apply to this note?" Multi-select from `3. Tags/`, "Other" adds new. Create stubs.
3. **Source links.** Ask: "Which source material links to this note?" Multi-select from `2. Source Material/`. Add each to `# Reference`.
4. **Sub-references.** Ask: "Does a topic need its own main note?" Tell the user you link it from this note. For each topic the user picks, create a new Main Note. Link it with `[[…]]` from this note.

File the note in `6. Main Notes/`.

### Path C — Rough Note (temporary staging)
A rough note is a scratch buffer. Keep it light. Do not force the full wrapper.
1. **Title.** Ask: "What is the title of this rough note?" Free text.
2. Write the content as-is under a `# Title` H1. Do not require tags, sections, or a `# Reference`.
3. File the note at `1. Rough Notes/<Title>.md`.
4. Skip promotion and source links. The user moves a rough note to another section later if it becomes permanent.

### Intake rules (all paths)
- Keep tags between one and five per note. Warn the user if the count goes over five.
- Do not guess a title, a tag, a subfolder, or a source. Ask.

## Conversion procedure (after the intake)

1. **Strip foreign wrappers** — remove YAML frontmatter (`--- … ---`), `#hashtag` lines, and plugin metadata.
2. **Add the wrapper** — date line, blank line, `Tags: [[…]]`, blank line, `# Title`.
3. **Write the body** — Path A: `## ` sections (linked heading for promoted topics, inline bullets for the rest). Path B: an atomic mini-essay. Keep existing content verbatim unless the user asks for a rewrite.
4. **Add `# Reference`** — link the source note (from a promoted main note) or the linked source material (Path B).
5. **Create missing tag stubs** — write an empty `.md` in `3. Tags/` for each new tag.
6. **Interlink** — the source note links to each promoted main note (`## [[Topic]]`); each promoted main note links back in `# Reference`. Both links must resolve.
7. **Place the files** — source note → `2. Source Material/<subfolder>/`; main notes → `6. Main Notes/`; scratch → `1. Rough Notes/`.

## Notes
- Source of truth for the system: `reference/obsidian-structure.md` (copy of the user's structure doc).
- When unsure which tags apply, which subfolder fits, or where a note belongs, ask rather than guess.
