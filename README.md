# Arabic PR browser verification

Tested 2026-09-19 against application commit `24d5dfc3a931f61b3edade5dd9d04e6b05159042` from `renanbazinin/open-notebook:codex/arabic-pr-1277-followup`.

- Frontend: Next.js development server, actual branch source, default desktop viewport (1280 x 720).
- Backend: local FastAPI from the same branch, no mocked endpoints.
- Database: separate SurrealDB v2 Docker container, disposable in-memory database; migrations completed through version 23.
- Worker: surreal-commands worker running with the same database.
- Test data: one sample notebook created through the browser UI. No personal research data or provider credentials used.

## Observations

1. Created a notebook and confirmed it appeared in the list.
2. Opened the language menu on Notebooks: Arabic is selectable.
3. Selected Arabic without visiting Settings: document `lang=ar-SA`, `dir=rtl`.
4. Reloaded Notebooks: Arabic and RTL persisted.
5. Navigated to Settings: document remained `lang=ar-SA`, `dir=rtl`.
6. Selected French on Settings: document changed to `lang=fr-FR`, `dir=ltr`.
7. Returned to Notebooks and selected English: document changed to `lang=en-US`, `dir=ltr`.
8. Browser console error query returned no entries during this test.

## Screenshots

These are unedited browser captures. This evidence branch keeps the images out of the application PR's code diff.

- `01-language-menu.png`: Arabic appears in the language menu on Notebooks.
- `02-arabic-notebooks.png`: Arabic selected outside Settings; sidebar appears on the right.
- `03-arabic-settings.png`: Arabic Settings after reload and navigation.
- `04-french-settings.png`: French selected afterward; sidebar returns to the left.

## Limits

This is a desktop browser smoke test, not a complete RTL audit. Arabic translation quality still requires a fluent reviewer. Mobile layouts, Radix keyboard direction, editor behavior, and mixed-language research content were not comprehensively tested. No AI generation, source processing, or podcast workflow was exercised. The complete release Docker image was not built; only the database ran in Docker.