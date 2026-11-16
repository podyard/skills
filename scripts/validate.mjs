#!/usr/bin/env node
/**
 * Skill validation script.
 *
 * Verifies:
 *  1. skills/SKILL.md exists with valid YAML frontmatter (name + description)
 *  2. Every references/*.md file linked from SKILL.md exists
 *  3. All reference files are non-empty
 *  4. package.json is valid JSON and `files` covers the skill directory
 *  5. (optional, with --pack) `npm pack --dry-run` passes
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillDir = join(root, "skills");
const skillMdPath = join(skillDir, "SKILL.md");
const referencesDir = join(skillDir, "references");

let failures = 0;

function pass(msg) {
  console.log(`  \u2713 ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`  \u2717 ${msg}`);
}

// --- 1. SKILL.md frontmatter -------------------------------------------------

console.log("SKILL.md");

if (existsSync(skillMdPath)) {
  const content = readFileSync(skillMdPath, "utf8");

  const frontmatterMatch = content.match(
    /^---\r?\n(?<frontmatter>[\s\S]*?)\r?\n---\r?\n/u
  );
  if (frontmatterMatch) {
    const { frontmatter } = frontmatterMatch.groups;
    const nameMatch = frontmatter.match(/^name:\s*(?<value>.+)\s*$/mu);
    const descriptionMatch = frontmatter.match(
      /^description:\s*(?<value>.+)\s*$/mu
    );

    if (nameMatch?.groups.value) {
      const name = nameMatch.groups.value.trim();
      if (/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/u.test(name)) {
        pass(`name: ${name}`);
      } else {
        fail(
          `frontmatter name "${name}" should be lowercase alphanumerics, underscores, or dashes`
        );
      }
    } else {
      fail("frontmatter is missing a `name` field");
    }

    if (descriptionMatch?.groups.value) {
      const description = descriptionMatch.groups.value.trim();
      if (description.length < 20) {
        fail("frontmatter description is suspiciously short (< 20 chars)");
      } else if (description.length > 1024) {
        fail(
          `frontmatter description is ${description.length} chars (max 1024)`
        );
      } else {
        pass(`description (${description.length} chars)`);
      }
    } else {
      fail("frontmatter is missing a `description` field");
    }
  } else {
    fail("missing YAML frontmatter block (--- ... ---) at top of file");
  }

  // --- 2. reference links resolve -------------------------------------------

  console.log("Reference links");

  const linkPattern = /references\/(?<file>[A-Za-z0-9_\-./]+\.md)/gu;
  const linked = new Set();
  for (const match of content.matchAll(linkPattern)) {
    const rel = `references/${match.groups.file.replace(/\/+/gu, "/")}`;
    linked.add(rel);
  }

  if (linked.size === 0) {
    fail("no references/*.md links found in SKILL.md");
  } else {
    for (const rel of [...linked].sort()) {
      const p = join(skillDir, rel); // rel is "references/<file>.md"
      if (existsSync(p)) {
        pass(`references/${rel} exists`);
      } else {
        fail(`linked references/${rel} does not exist`);
      }
    }
  }

  // --- 3. reference files are non-empty and are actually linked -------------

  console.log("Reference files");

  if (existsSync(referencesDir)) {
    const files = readdirSync(referencesDir).filter((f) => f.endsWith(".md"));
    if (files.length === 0) {
      fail("skills/references/ contains no .md files");
    }
    for (const f of files.sort()) {
      const p = join(referencesDir, f);
      const size = readFileSync(p, "utf8").length;
      if (size < 100) {
        fail(`references/${f} looks empty (${size} chars)`);
      }
      if (!linked.has(`references/${f}`)) {
        fail(`references/${f} exists but is not linked from SKILL.md`);
      }
    }
  } else {
    fail("skills/references/ directory not found");
  }
} else {
  fail("skills/SKILL.md not found");
}

// --- 4. package.json ---------------------------------------------------------

console.log("package.json");

const packageJsonPath = join(root, "package.json");
if (existsSync(packageJsonPath)) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  } catch (err) {
    fail(`package.json is not valid JSON: ${err.message}`);
    pkg = null;
  }

  if (pkg) {
    for (const field of ["name", "version", "license"]) {
      if (!pkg[field]) {
        fail(`package.json is missing required field "${field}"`);
      }
    }
    if (
      Array.isArray(pkg.files) &&
      !pkg.files.some((f) => f === "skills" || f.startsWith("skills/"))
    ) {
      fail('package.json "files" does not include the skills/ directory');
    } else if (Array.isArray(pkg.files)) {
      pass(`files: [${pkg.files.join(", ")}]`);
    } else {
      pass("files field present");
    }
    if (!/^v?\d+\.\d+\.\d+$/u.test(pkg.version ?? "")) {
      fail(`version "${pkg.version}" is not semver`);
    }
  }
} else {
  fail("package.json not found");
}

// --- 5. optional npm pack ----------------------------------------------------

if (process.argv.includes("--pack")) {
  console.log("npm pack (dry run)");
  try {
    const out = execFileSync("npm", ["pack", "--dry-run"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const packedFiles = out
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) => l.endsWith(".md") || l === "package.json" || l.endsWith(".jpg")
      );
    pass(`pack OK (${packedFiles.length} content files listed)`);
  } catch (err) {
    fail(`npm pack --dry-run failed: ${String(err.message).split("\n")[0]}`);
  }
}

console.log("");
if (failures > 0) {
  console.error(`${failures} check(s) failed.`);
  process.exit(1);
} else {
  console.log("All checks passed.");
}
