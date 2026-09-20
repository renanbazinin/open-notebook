# PR #1367 — follow-up to the 11-finding review

Application commit: `3c501ab6bd635fddaa72b0c0e90709a874c41a2e`, tested 2026-09-20.

## Review changes

- Reproduced a real hydration error with English server output and saved Arabic client translations using `renderToString` and `hydrateRoot`. The provider now renders the same empty placeholder on both sides and mounts children only after client initialization and language readiness. Tests also cover delayed detection.
- Added one self-contained locale resolver shared by the startup script and browser detector. Regionless `ar` and `fr` resolve to their sole registered variants. Unsupported and ambiguous tags keep the English fallback. Saved and browser preference paths are covered.
- Corrected Arabic labels in their UI context: theme in quick actions, build date, saving in progress, creation timestamp, and insights count.
- Restored native Arabic and Italian language names in the English menu.
- Tightened the timing test to exactly four observations and the expected language sequence.
- Updated ADR-009 with the discussion link, hydration approach, Radix direction context, and editor behavior.

The bot's detailed explanation of regionless Arabic was not fully accurate: the provider uses the resolved translation language, not simply the requested tag. The missing Arabic selection was real, and both detection and startup now share the corrected resolution rule. Similarly, the old timing test could record duplicate mounts; the new neutral placeholder avoids the extra mount and the assertion verifies the full sequence.

## Validation

| Check | Result |
| --- | --- |
| Linux frontend coverage suite | 211 passed across 35 files |
| Linux frontend lint | 0 errors, 7 warnings in unchanged files |
| Production frontend build and TypeScript check | Passed in Docker build |
| Full linux/amd64 Docker runtime build | Passed |
| Compiled startup script from served production HTML | 12 saved/browser preference cases passed |
| Backend | Unchanged since d089f1c: 751 tests, lint and typecheck previously passed in Linux |

The new hydration and regionless-language regressions failed before the fixes and pass afterward. The final source was exported from git for the Docker build. Frontend tests and lint used the existing Node 22 Linux builder with this exact source mounted read-only. Raw logs are saved in the local QA folder; upstream GitHub checks are separate.

## Local deployment and manual checks

Deployed `open-notebook:pr1367-3c501ab` at `http://127.0.0.1:3138`, with the real API and worker connected to the existing disposable QA database. Image ID: `sha256:813025e542f44049f5275b673f437ff9abfdf9c84e18a717b12ebb40341f672a`.

- English menu shows العربية and Italiano.
- Arabic survives reload on Settings with `lang=ar-SA`, `dir=rtl`; the updated quick-actions theme description is present.
- Arabic portalled menu receives RTL context.
- At 390px, ArrowLeft moves Sources to Notes in Arabic; after selecting English and reloading, ArrowRight moves Sources to Notes and both document and tabs use LTR.
- Arabic/Hebrew/English text and bold Markdown display in separate editor and preview panes at 390px.
- Browser warning/error queries were empty after the final reload checks.

Existing small-screen Settings overflow/sidebar spacing and breakpoint-related draft limitations documented in the preceding review remain outside these changes. No new upstream deployment or merge was performed; this is the local preview deployment and PR update.

## Screenshots from this build

- [Arabic Settings after reload](screenshots/arabic-settings-after-reload.png)
- [Mixed-language mobile editor](screenshots/arabic-mobile-editor.png)
