import { css } from '@emotion/css'

export function getFontClassName(largeFont: boolean) {
  return largeFont
    ? css`
        font-size: 16px;
        @media screen and (min-width: 600px) {
          font-size: 24px;
        }
      `
    : css`
        font-size: 12px;
        @media screen and (min-width: 600px) {
          font-size: 16px;
        }
      `
}
