# Security

## What this skill can do

`obsidian-notes-skill` is a set of instructions for Claude Code. It has no runtime of its own. When Claude follows it, Claude:

- reads and writes Markdown files **only** under the vault path you configure in `SKILL.md`;
- creates folders and empty tag-stub notes inside that vault;
- makes **no network calls** and sends **no data** anywhere.

It does not read files outside the configured vault, and it does not require or store any credentials.

## What you should not commit

This repository must never contain personal or secret data. Do not commit:

- absolute home paths (`/Users/<name>/…`, `/home/<name>/…`);
- email addresses or other personal identifiers;
- API keys, tokens, or private keys of any kind;
- the contents of a real Obsidian vault.

Run the guard before every commit and push:

```bash
bash scripts/check-secrets.sh
```

It fails if the tree matches a home path, an email, or a common key pattern. To run it automatically, install it as a local hook:

```bash
ln -s ../../scripts/check-secrets.sh .git/hooks/pre-commit
```

## Reporting a problem

Open a private security advisory on the GitHub repository, or open an issue that does **not** include sensitive detail. You will get a response as soon as possible.
