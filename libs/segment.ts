/* eslint-disable no-control-regex */

import compact from 'lodash/compact'

export function segment(word?: string): string[] {
  if (!word) {
    return []
  }
  const cjkItems = word.replace(/[\x00-\x7F]/g, '').split('')
  const asciiItems = word.replace(/[^\x00-\x7F]/g, '').split(/[\W-_]+/)
  return compact([...cjkItems, ...asciiItems])
}
