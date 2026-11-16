![Podyard](banner.jpg)

# Podyard Skills

Podyard agent skill. Provides expert assistance for podyard — installation,
setup, architecture, packages, customization, deployment, and development
workflows.

Published to npm as [`@podyard/skills`](https://www.npmjs.com/package/@podyard/skills)
under the Apache-2.0 license.

## Install

```bash
npm install @podyard/skills
```

## Usage

The skill lives at `node_modules/@podyard/skills/skills/`. Point your agent
harness (Claude Code, OpenCode, or any skills-compatible harness) at that
directory to load the `SKILL.md` and its references.

```
skills/
├── SKILL.md              # Main skill definition
└── references/
    ├── architecture.md   # Full monorepo structure
    ├── setup.md          # Installation & environment setup
    ├── packages.md       # Detailed package docs
    └── customization.md  # Swapping providers, deployment
```

## Install via skills.sh

If your harness supports skills.sh:

```bash
npx skills.sh add podyard/skills
```

## Repository layout

```
.
├── skills/                   # The skill itself (what the package ships)
│   ├── SKILL.md
│   └── references/           # Topic-specific reference docs
├── scripts/
│   └── validate.mjs          # Skill validation (frontmatter, links, pack)
├── .github/
│   └── workflows/
│       ├── ci.yml            # Validate on every push / PR
│       └── release.yml       # Publish to npm on v* tags
├── package.json              # npm package definition
├── CHANGELOG.md              # Release history
├── CONTRIBUTING.md           # How to contribute
└── LICENSE.md                # Apache-2.0
```

## Development

```bash
pnpm install        # no runtime dependencies — lockfile kept for CI consistency
pnpm run check      # validate skill frontmatter, reference links, package.json
pnpm run check:pack # above + a dry-run npm pack
```

The `check` script verifies that `SKILL.md` has valid frontmatter, that every
`references/*.md` file is linked from `SKILL.md` and vice versa, and that the
package metadata is publishable. It also runs as `prepublishOnly`, so a
broken skill can never be published.

## Releases

Pushing a `v*` tag (e.g. `v0.2.0`) triggers `.github/workflows/release.yml`,
which publishes the package to npm using the repo's `NPM_TOKEN` secret.
Manual publishing: `pnpm run publish` (requires access to the `@podyard`
scope). See [CONTRIBUTING.md](CONTRIBUTING.md) for the full release flow.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache-2.0](LICENSE.md)
