'use client'

import * as React from 'react'

export type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  storageKey?: string
}>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <>{children}</>
}
