'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DirectionProvider } from '@radix-ui/react-direction'
import '@/lib/i18n'
import { LanguageLoadingOverlay } from '@/components/common/LanguageLoadingOverlay'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage || i18n.language || 'en-US'
  const direction = language.startsWith('ar') ? 'rtl' : 'ltr'

  useLayoutEffect(() => {
    // Describe the language actually rendered, including translation fallbacks.
    document.documentElement.lang = language
    document.documentElement.dir = direction
  }, [language, direction])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    // Radix controls and portals use context, not the document's dir attribute.
    <DirectionProvider dir={direction}>
      {mounted ? (
        <>
          <LanguageLoadingOverlay />
          {children}
        </>
      ) : (
        <div style={{ visibility: 'hidden' }}>{children}</div>
      )}
    </DirectionProvider>
  )
}
