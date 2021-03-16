import { renderToStaticMarkup } from 'react-dom/server'
import svgToMiniDataURI from 'mini-svg-data-uri'
import { ReactElement } from 'react'

export function SVG2DataURI(icon: ReactElement) {
  return `url("${svgToMiniDataURI(renderToStaticMarkup(icon))}")`
}
