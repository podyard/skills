# @podyard/skills

## 0.1.0

### Initial release

- Split out from the podyard monorepo.
- Skill definition (`SKILL.md`) with references for architecture, setup,
  packages, and customization.
- Apache-2.0 LICENSE, GitHub Actions release workflow (publish on `v*` tags).

## Unreleased

- Repository infrastructure: `CI` workflow, `scripts/validate.mjs` skill
  validation (frontmatter, reference links, `npm pack` dry-run) wired into
  `check:skill`, `check:pack`, and `prepublishOnly` scripts.
- Code style: Ultracite (Biome) configured via `biome.json` /
  `ultracite.json`; `check` and `fix` scripts.
- `CONTRIBUTING.md`, expanded `README.md`, `.editorconfig`, `.npmignore`.
- `LICENSE` renamed to `LICENSE.md` (content unchanged); `banner.jpg`
  repository banner; package `files` now include `LICENSE.md` and
  `banner.jpg`.
- Skill directory renamed `skill/` to `skills/`.
