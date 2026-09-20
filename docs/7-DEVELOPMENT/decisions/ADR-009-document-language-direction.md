# ADR-009: Apply UI language and direction to the root document

- **Status**: Accepted
- **Date**: 2026-09
- **Related**: #1277, #1367, discussion [#1338](https://github.com/lfnovo/open-notebook/discussions/1338)

## Context

Arabic needs RTL on every route, including when the user restores a saved language without visiting Settings. Updating document metadata only in Settings leaves other routes with stale language and direction. The language detector stores preferences in localStorage, which the server cannot read.

## Decision

Set `html.lang` and `html.dir` centrally in `I18nProvider`, using i18next's resolved translation language rather than an unsupported requested language. Arabic language codes use RTL via the `ar` prefix; other currently supported languages use LTR. Apply changes in a layout effect before the translated React commit is painted.

A small inline script in the root layout applies the saved preference, or the first browser preference, before hydration. It embeds only registered locale codes and a self-contained resolver shared with the browser language detector. The resolver follows the language/script/base hierarchy and maps a regionless tag to its sole registered variant (`ar` → `ar-SA`, `fr` → `fr-FR`). Ambiguous or unavailable preferences use English. The provider remains authoritative after initialization.

Render a neutral empty placeholder on the server and first client pass, then mount children once the client and language detector are ready. A hidden wrapper still renders language-dependent children and cannot prevent hydration mismatches. Supply the same direction through Radix `DirectionProvider` for controls, keyboard navigation, and portals. The Markdown editor reads this context to enable its own RTL pane layout.

## Alternatives considered

- Settings-only or per-page effects leave gaps during navigation and reloads.
- Passive effects can update direction after a translated commit paints.
- Server-side cookie detection would require a new persistence and rendering contract for a preference currently stored in localStorage.

## Consequences

Routes inherit the document direction; Radix controls and portals receive the same direction through context. Translated UI waits for client initialization instead of producing language-dependent server markup. Unsupported preferences use the direction of the rendered fallback. Changes to detection order, fallback language or locale resolution must also update the bootstrap script and its parity tests. Direction-sensitive component positioning and mixed-language user content still require their own layout decisions.
