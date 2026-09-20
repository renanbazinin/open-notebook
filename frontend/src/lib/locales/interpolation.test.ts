import { describe, it, expect, beforeAll } from 'vitest'
import { createInstance } from 'i18next'
import { resources } from './index'

// Mirrors the interpolation config in src/lib/i18n.ts
const i18n = createInstance()

beforeAll(async () => {
  await i18n.init({
    resources,
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })
})

describe('i18next interpolation', () => {
  it('interpolates a single variable', () => {
    expect(i18n.t('chat.chatWith', { name: 'Sources' })).toBe('Chat with Sources')
  })

  it('interpolates multiple variables', () => {
    expect(i18n.t('sources.batchPartial', { success: 2, failed: 1 })).toBe(
      '2 succeeded, 1 failed',
    )
  })

  it('resolves plural forms from the base key', () => {
    expect(i18n.t('podcasts.usedByCount', { count: 1 })).toBe('Used by 1 episode')
    expect(i18n.t('podcasts.usedByCount', { count: 3 })).toBe('Used by 3 episodes')
  })

  it.each([
    [0, 'لا تستخدمه أي حلقة'],
    [1, 'تستخدمه حلقة واحدة'],
    [2, 'تستخدمه حلقتان'],
    [3, 'تستخدمه 3 حلقات'],
    [10, 'تستخدمه 10 حلقات'],
    [11, 'تستخدمه 11 حلقة'],
    [99, 'تستخدمه 99 حلقة'],
    [100, 'تستخدمه 100 حلقة'],
    [101, 'تستخدمه 101 حلقة'],
    [102, 'تستخدمه 102 حلقة'],
    [103, 'تستخدمه 103 حلقات'],
    [1.5, 'تستخدمه 1.5 حلقة'],
  ])('uses the Arabic plural form for %s episodes', (count, expected) => {
    expect(i18n.t('podcasts.usedByCount', { count, lng: 'ar-SA' })).toBe(expected)
  })

  it.each(Object.keys(resources).filter(lng => lng !== 'ar-SA'))(
    'keeps episode counts interpolated in %s', (lng) => {
      const other = resources[lng as keyof typeof resources].translation.podcasts.usedByCount_other
      for (const count of [0, 2, 3, 11, 100]) {
        expect(i18n.t('podcasts.usedByCount', { count, lng })).toBe(
          other.replace('{{count}}', String(count)),
        )
      }
    },
  )

  it('does not escape interpolated values (React escapes at render)', () => {
    expect(i18n.t('notebooks.deleteNotebookDesc', { name: 'Research & Notes' })).toBe(
      'Are you sure you want to delete "Research & Notes"? This action cannot be undone.',
    )
  })

  it('interpolates in a non-English locale', () => {
    expect(
      i18n.t('sources.selectedCount', { count: 4, lng: 'pt-BR' }),
    ).toContain('4')
  })
})
