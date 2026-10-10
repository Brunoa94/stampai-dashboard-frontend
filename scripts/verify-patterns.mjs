import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");

const errors = [];

const forbidden = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "p",
  "span",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "ul",
  "ol",
  "hr",
  "img",
];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await walk(file);

      continue;
    }

    const source = await readFile(file, "utf8");

    const relative = path.relative(root, file);

    if (entry.name === "index.ts")
      errors.push(`${relative}: barrel file is not permitted`);

    if (
      relative.startsWith("shared/") &&
      /(?:from\s*|import\s*\()['"]@\/features\//.test(source)
    )
      errors.push(`${relative}: shared code depends on a feature`);

    if (relative.startsWith("features/") && source.includes("@/features/")) {
      const feature = relative.split(path.sep)[1];

      for (const match of source.matchAll(/['"]@\/features\/([^/]+)\//g))
        if (match[1] !== feature)
          errors.push(`${relative}: cross-feature import`);
    }

    if (/\/ui\//.test(file) && /\.ts$/.test(file) && !/\.test\.ts$/.test(file))
      errors.push(`${relative}: extracted code must live in lib`);

    for (const match of source.matchAll(
      /(?:^|\n)\s*(?:export\s+)?type\s+(\w+)\s*[=<]/g,
    ))
      if (!match[1].endsWith("Type"))
        errors.push(`${relative}: type ${match[1]} requires Type suffix`);

    if (file.endsWith(".vue")) {
      if (/:(?:columns|items|options|context)\s*=\s*["']\s*[[{]/.test(source))
        errors.push(
          `${relative}: bind named typed configuration; inline arrays and objects are not permitted`,
        );

      if (!source.includes('<script setup lang="ts">'))
        errors.push(`${relative}: typed script setup required`);

      if (/\bdefineEmits\s*\(/.test(source))
        errors.push(`${relative}: typed events required`);

      if (!relative.startsWith("shared/ui/"))
        for (const tag of forbidden)
          if (new RegExp(`<${tag}(?:\\s|>)`).test(source))
            errors.push(
              `${relative}: use the design-system primitive for <${tag}>`,
            );

      if (/\sstyle=["']/.test(source))
        errors.push(`${relative}: static inline styles are not permitted`);

      if (/v-html\s*=/.test(source))
        errors.push(`${relative}: returned content must remain plain text`);
    }
  }
}

for (const entry of await readdir(path.join(root, "features"), {
  withFileTypes: true,
})) {
  if (!entry.isDirectory()) continue;

  try {
    const documentation = await readFile(
      path.join(root, "features", entry.name, "README.md"),
      "utf8",
    );

    if (!documentation.trim())
      errors.push(
        `features/${entry.name}: feature README.md must not be empty`,
      );
  } catch {
    errors.push(
      `features/${entry.name}: required feature README.md is missing`,
    );
  }
}

await walk(root);

if (errors.length) {
  console.error(errors.join("\n"));

  process.exitCode = 1;
} else
  console.info(
    "Architecture patterns verified: typed SFCs, primitives, type suffixes, feature boundaries, no barrels, no static inline styles, plain text rendering, feature READMEs.",
  );
