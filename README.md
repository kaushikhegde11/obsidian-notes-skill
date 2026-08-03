# obsidian-notes-skill

A [Claude Code](https://claude.com/claude-code) **skill** that files and formats notes into a minimalist, plugin-free Obsidian Zettelkasten vault. When you ask Claude to make or convert an Obsidian note, the skill runs a short intake (title, tags, section, promotion) and then writes correctly structured Markdown into the right folder.

It is built around a six-folder system: `1. Rough Notes`, `2. Source Material`, `3. Tags`, `4. Template`, `5. Indexes`, `6. Main Notes`. Tags are empty `[[wikilink]]` notes, not `#hashtags` or YAML.

## What it does

- **Asks before it writes.** One short question at a time (Simplified Technical English). No guessed titles, tags, or locations.
- **Three note types.** Rough note (scratch), Source Material note (a container filed under a media subfolder), or a standalone Main Note.
- **Topic promotion.** In a Source Material note, you pick which topics deserve their own page. Each becomes a `## [[Topic]]` linked heading plus a full Main Note; the rest stay as inline bullets.
- **Keeps the graph connected.** Creates missing tag stubs and back-links between notes so nothing is orphaned.

## Requirements

- Claude Code installed.
- An Obsidian vault that uses (or will adopt) the six-folder structure described in [`reference/obsidian-structure.md`](reference/obsidian-structure.md).

## Install

Clone straight into your Claude Code skills directory:

```bash
git clone https://github.com/kaushikhegde11/obsidian-notes-skill \
  ~/.claude/skills/obsidian-notes-skill
```

Claude Code discovers the skill on the next session.

## First run: the setup wizard

You do not edit `SKILL.md`. The first time you use the skill, it runs a short **setup wizard**:

1. It asks for your vault path and scans your top-level folders.
2. It offers a layout preset — **Zettelkasten**, **PARA**, **Flat**, or **Custom** — and lets you adjust it.
3. It asks you to map roles (rough / source / main / tags …) to your real folders, and to pick your **tag style**, **date format**, and **promotion style**.
4. It saves your answers to `vault-config.yaml` in the skill folder.

Every later run reads `vault-config.yaml` and skips the wizard. To reconfigure, delete that file (or edit it by hand) and run the skill again.

### Configure by hand instead

Prefer not to use the wizard? Copy the template and edit it:

```bash
cp ~/.claude/skills/obsidian-notes-skill/vault-config.example.yaml \
   ~/.claude/skills/obsidian-notes-skill/vault-config.yaml
```

`vault-config.example.yaml` documents every field. Key points:

- Any folder role may be `null` or `""`. An empty role falls back to `folders.default`. Set `default: ""` for a **flat vault** (notes go in the vault root).
- `tags.style` is one of `wikilink-stub`, `hashtag`, `yaml`, or `none`.
- `date.format` is one of `DD-MM-YYYY`, `YYYY-MM-DD`, `DD-Mon-YYYY`, or `null`.
- `promotion` controls whether a source topic can become its own main note, and the link style.

Your real `vault-config.yaml` is gitignored — it holds a machine path and is never committed.

### Works with any vault

The skill does not assume a fixed layout. Zettelkasten, PARA, a flat folder of notes, or your own scheme all work — the config describes your vault, and the skill follows it. The [`reference/obsidian-structure.md`](reference/obsidian-structure.md) file describes the Zettelkasten preset as one example.

## How access works (permissions)

Installing this skill grants it **nothing**. A skill is plain Markdown instructions — no code, no runtime, no install-time permission prompt. `git clone` only drops text files into `~/.claude/skills/`.

The skill never gets "access to your vault." When you invoke it and Claude goes to write a note, the actual file read/write is performed by **Claude Code's own tools**, gated by **Claude Code's permission system**:

- Claude Code asks *you* per action — e.g. "allow write to `…/6. Main Notes/x.md`?" — unless you have pre-allowed those paths in your settings.
- The session runs as your user account, so it can only reach files you can already reach. There is no separate login or OAuth grant.

The only setup step is a **config edit, not a permission grant**: open `SKILL.md` and set `<VAULT_ROOT>` to your vault path. Until you do, the skill has no path to act on.

**Trust model.** Because a skill can point Claude at any path you configure, the safeguard is that `SKILL.md` is short and auditable — read it before you use it. This skill makes no network calls and handles no secrets (see [`SECURITY.md`](SECURITY.md)).

**On allow-listing.** You may add the vault path to your Claude Code allow-list to stop the per-file prompts. That is your choice, with a tradeoff: fewer prompts, but Claude can then write anywhere under that path without asking. The default (prompt per action) is the safer setting.

## Usage

In Claude Code:

```
/obsidian-notes-skill
make a note on what I learned this week
```

Then answer the intake prompts. The skill creates the files in your vault and reports what it wrote.

## Security

This skill runs entirely on your machine. It reads and writes files under the vault path **you** configure, and makes no network calls. See [`SECURITY.md`](SECURITY.md). A `scripts/check-secrets.sh` guard is included so contributors do not commit personal paths, emails, or keys.

## Related

- [obsidian-project-memory](https://github.com/kaushikhegde11/obsidian-project-memory) — companion skills that give each project a durable memory (README / STATUS / progress / decisions) in your vault.

## License

[MIT](LICENSE).
