# Contributing

Thanks for improving the Podyard skill! This repo ships the `podyard` agent
skill as the [`@podyard/skills`](https://www.npmjs.com/package/@podyard/skills)
npm package.

## What lives here

```
skills/
├── SKILL.md              # Skill definition (frontmatter + instructions)
└── references/
    ├── architecture.md   # Full monorepo structure
    ├── setup.md          # Installation & environment setup
    ├── packages.md       # Detailed package docs
    └── customization.md  # Swapping providers, deployment
```

The skill is plain Markdown: it's read by agent harnesses (Claude Code,
OpenCode, etc.), never executed. Keep it factual, current, and concise.

## Requirements

- Node.js 22+ and pnpm 9+
- A GitHub account with push access to `podyard/skills`

## Workflow

1. Fork the repo and create a branch:

   ```bash
   git checkout -b feat/your-branch
   ```

2. Edit the Markdown under `skills/`. Keep changes consistent with the
   current state of the [podyard monorepo](https://github.com/podyard) —
   when the template changes, the skill must change with it.

3. Validate the skill:

   ```bash
   pnpm run check
   ```

   This verifies the frontmatter in `SKILL.md`, that every `references/...`
   link resolves, and that the published package layout is sound (`npm pack`).

4. Commit with a conventional-commit subject (`feat:`, `fix:`, `docs:`,
   `chore:`):

   ```bash
   git add -A && git commit -m "docs: add rate-limit package reference"
   ```

5. Open a pull request.

## Skill authoring guidelines

- **Frontmatter**: `SKILL.md` must start with YAML frontmatter containing a
  `name` (lowercase, no spaces) and a `description` that clearly states what
  the skill does and when it should trigger.
- **Descriptions**: write for the agent's retrieval, not for humans.
  Include concrete trigger phrases (e.g. "podyard installation", "add a
  package to podyard").
- **References**: keep each `references/*.md` focused on one topic. Link to
  them from `SKILL.md` so agents know they exist.
- **Length**: `SKILL.md` should stay under ~500 lines. Push detail into
  references.
- **No secrets**: never commit real API keys, tokens, or `.env` files.

## Releases

Releases are automated by GitHub Actions: pushing a `v*` tag (e.g. `v0.2.0`)
publishes to npm using the repo's `NPM_TOKEN` secret.

To release:

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
2. Push the change to `main`.
3. Create and push the tag:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

Manual publishing from your machine (requires an npm account with access to
the `@podyard` scope):

```bash
pnpm run publish
```
