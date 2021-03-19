import { useEffect, useState } from 'react'

export function useDarkMode(): boolean {
  const [isDarkMode, setIsDarkMode] = useState(false)
  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    function darkListener(e: MediaQueryListEvent) {
      if (e.matches) {
        setIsDarkMode(true)
      }
    }
    function lightListener(e: MediaQueryListEvent) {
      if (e.matches) {
        setIsDarkMode(false)
      }
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', darkListener)
    window
      .matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', lightListener)
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', darkListener)
      window
        .matchMedia('(prefers-color-scheme: light)')
        .removeEventListener('change', lightListener)
    }
  }, [])
  return isDarkMode
}
