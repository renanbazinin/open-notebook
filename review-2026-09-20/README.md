# PR #1367 — second review and verification

Tested on 2026-09-20. Final application commit: `8f38fdc8e1863ae650504a125d99eea3fc665811`.

## Fixes found during this review

- Radix tabs and portalled menus did not inherit the document's RTL direction. A shared DirectionProvider now supplies it. Regression tests cover Arabic/English arrow-key navigation and menu direction.
- The Markdown editor's input and preview occupied the same half of the dialog in Arabic. The editor now receives its supported direction option from the same provider. A regression test uses the real editor and checks RTL-to-LTR changes.

## Automated checks

All seven CI equivalents passed locally in Linux containers. These local results do not replace upstream GitHub check statuses.

| Check | Result | Revision |
| --- | --- | --- |
| Backend tests (`uv run pytest tests/`) | 751 passed, 2 dependency warnings | d089f1c |
| Backend lint (`ruff check .`) | Passed | d089f1c |
| Backend typecheck (`mypy .`) | Passed, 138 source files | d089f1c |
| Frontend coverage tests | 202 passed, 34 files | 8f38fdc |
| Frontend lint | Passed, 0 errors; 7 warnings in unchanged files | 8f38fdc |
| Frontend production build | Passed in the Docker frontend-builder stage | 8f38fdc |
| Full Docker runtime build, linux/amd64 | Passed | 8f38fdc |

The last commit changes only the editor and its regression test; backend files and dependencies are identical to the tested d089f1c revision. Final frontend tests/lint used the Node 22 builder image with the exact final source mounted read-only. The final runtime image was built from a clean git archive using the repository Dockerfile.

Runtime image: `open-notebook:pr1367-8f38fdc`, image ID `sha256:eace9d5c4c53b334530610017c67d6bb03f7a29d93333fa37fd604355839faf0`.

## Manual browser checks

Ran the production image with a separate disposable SurrealDB v2 database, real API and worker. Startup migrations reached version 25. No provider credentials or personal research data were used.

- Created a notebook with an Arabic/Hebrew/English title through the UI.
- Selected Arabic, reloaded and navigated to Settings: document language ar-SA and direction RTL persisted.
- Confirmed the language popup uses RTL in Arabic and LTR after switching to English.
- At 390px, Arabic ArrowLeft moves Sources to Notes; English ArrowRight moves Sources to Notes. These checks ran on d089f1c, whose provider and tab code are unchanged in the final commit.
- Entered Arabic, Hebrew, English, numbers and Markdown bold text in the final editor at 390px and 1280px. Input and preview occupy separate panes, and the formatted preview renders correctly.
- Saved a test note successfully through the UI.
- Inspected Settings at 768px and 360px. Tablet layout is readable. Long environment-variable strings still overflow on narrow phones; expanded sidebar spacing also remains cramped (observed in both English and Arabic during comparison).
- An unsaved note dialog disappears when resizing across the mobile/desktop notebook breakpoint. This follows the existing separate mobile/desktop layout mounting behavior and was not changed in this RTL update.
- Browser warning/error query returned no entries for the final production checks. AI generation workflows were outside this UI check.

## Screenshots

Unedited captures from the final production image:

- [Arabic editor, 390px](screenshots/arabic-editor-390.png)
- [Arabic editor, 1280px](screenshots/arabic-editor-desktop.png)
- [Arabic Settings, 768px](screenshots/arabic-settings-768.png)
- [Arabic Settings, narrow phone](screenshots/arabic-settings-360.png)
- [English language menu after switching back](screenshots/english-settings-desktop.png)

The local evidence folder also contains raw build/lint/test logs. Backend logs are in the adjacent `qa-d089f1c/logs` folder.
