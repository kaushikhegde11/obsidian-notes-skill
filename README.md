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

## Configure your vault path

The skill ships with a placeholder, `<VAULT_ROOT>`. Point it at your vault by editing two lines in `SKILL.md`:

1. The `description:` line in the front matter — replace *"The vault path is set by the user (see README)."* with your absolute vault path.
2. The `**Vault root:**` line near the top of the body — replace `<VAULT_ROOT>` with the same path.

Example:

```
**Vault root:** `~/Documents/Obsidian/MyVault`
```

Nothing else is machine-specific. The folder and tag names the skill reads (`3. Tags/`, `2. Source Material/…`) are discovered live from your vault at runtime.

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

## License

[MIT](LICENSE).
