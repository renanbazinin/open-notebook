import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/lib/i18n'
import { arSA } from '@/lib/locales'
import { I18nProvider } from './I18nProvider'

beforeEach(async () => {
  await i18n.changeLanguage('en-US')
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
})

afterEach(() => {
  cleanup()
  i18n.removeResourceBundle('ar-EG', 'translation')
  localStorage.clear()
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
})

describe('I18nProvider document language', () => {
  it('applies a saved Arabic language on mount without visiting Settings', async () => {
    await i18n.changeLanguage('ar-SA')

    render(<I18nProvider><main>Notebook</main></I18nProvider>)

    expect(document.documentElement).toHaveAttribute('lang', 'ar-SA')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })

  it('updates direction and language when switching Arabic, French, and English', async () => {
    render(<I18nProvider><main>Notebook</main></I18nProvider>)

    for (const [language, direction] of [['ar-SA', 'rtl'], ['fr-FR', 'ltr'], ['en-US', 'ltr']]) {
      await act(async () => { await i18n.changeLanguage(language) })

      expect(document.documentElement).toHaveAttribute('lang', language)
      expect(document.documentElement).toHaveAttribute('dir', direction)
    }
  })

  it('supports another Arabic variant when its translations are available', async () => {
    // A fixture checks the Arabic prefix without exposing an untranslated locale.
    i18n.addResourceBundle('ar-EG', 'translation', arSA)
    await i18n.changeLanguage('ar-EG')

    render(<I18nProvider><main>Notebook</main></I18nProvider>)

    expect(document.documentElement).toHaveAttribute('lang', 'ar-EG')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })

  it('uses the rendered English fallback for an unsupported RTL preference', async () => {
    await i18n.changeLanguage('he-IL')

    render(<I18nProvider><main>Notebook</main></I18nProvider>)

    expect(document.documentElement).toHaveAttribute('lang', 'en-US')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
  })
})
