---
name: Workspace package cleanup
description: Non-obvious workspace behavior to check after removing frontend dependencies.
---

When removing packages from a pnpm workspace, re-check `.replit` after the package tool finishes and restore only intended configuration changes before completing the work.

**Why:** The package-management operation may update workspace-level configuration as a side effect, even when the requested change is limited to one artifact's dependencies.

**How to apply:** Compare `.replit` with its prior state and run the full workspace typecheck after dependency cleanup; do not assume a successful package install changed only `package.json` and `pnpm-lock.yaml`.