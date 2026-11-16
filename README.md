# @podyard/skills

Podyard agent skill. Provides expert assistance for podyard — installation,
setup, architecture, packages, customization, deployment, and development
workflows.

## Install

```bash
npm install @podyard/skills
```

## Usage

The skill lives at `node_modules/@podyard/skills/skill/`. Point your agent
harness at that directory to load the SKILL.md and its references.

```
skill/
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
