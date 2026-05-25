import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Resolve sibling `@mongez/*` packages from the local monorepo when their
 * source folders exist, otherwise let Vite fall back to `node_modules`.
 *
 * In day-to-day development every package lives next to its siblings, so
 * the alias short-circuits the published-package resolution and gives us
 * live cross-package edits. In a CI environment that only checked out
 * THIS repo, the sibling directories are absent and the alias is omitted,
 * so the test run resolves siblings from npm exactly like a consumer.
 *
 * `@mongez/dom` currently has no runtime `@mongez/*` siblings, but the
 * helper is kept so future deps slot in without touching CI plumbing.
 */
function localSiblingAliases(): Record<string, string> {
  const candidates: Record<string, string> = {};
  const aliases: Record<string, string> = {};
  for (const [pkg, rel] of Object.entries(candidates)) {
    const abs = path.resolve(__dirname, rel);
    if (fs.existsSync(abs)) aliases[pkg] = abs;
  }
  return aliases;
}

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["src/**/*.test.ts"],
    // Disable network fetches that happy-dom would otherwise trigger
    // when our code inserts `<link rel="stylesheet">` and `<script src>`
    // tags with absolute URLs. The DOM mutations we care about happen
    // synchronously during `appendChild`; loading the resource is not
    // part of this package's contract.
    environmentOptions: {
      happyDOM: {
        settings: {
          disableJavaScriptFileLoading: true,
          disableCSSFileLoading: true,
          disableIframePageLoading: true,
        },
      },
    },
  },
  resolve: {
    alias: localSiblingAliases(),
  },
});
