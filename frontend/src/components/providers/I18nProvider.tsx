'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import { LanguageLoadingOverlay } from '@/components/common/LanguageLoadingOverlay'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage || i18n.language || 'en-US'

  useLayoutEffect(() => {
    // Describe the language actually rendered, including translation fallbacks.
    document.documentElement.lang = language
    document.documentElement.dir = language.startsWith('ar') ? 'rtl' : 'ltr'
  }, [language])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <>
      <LanguageLoadingOverlay />
      {children}
    </>
  )
}
