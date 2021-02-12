import flatten from 'lodash/flatten'
import type { NextApiRequest, NextApiResponse } from 'next'

import { Asset, AssetType } from '../../libs/types'

function unescapeUnicode(text?: string): string {
  return (
    text?.replace(/\\u([a-fA-F0-9]{4})/g, (_g, m1) =>
      String.fromCharCode(parseInt(m1, 16)),
    ) || ''
  )
}

function parseText(text: string): string[][] {
  const matched = text.match('"(.+)"')?.[1]
  if (!matched || matched === 'N') {
    return []
  }
  return matched.split('^').map((item) => item.split('~'))
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { keyword } = req.query as { keyword: string }
  const list: Asset[][] = await Promise.all([
    fetch(
      `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(keyword)}&t=gp`,
      {},
    )
      .then((response) => response.text())
      .then(parseText)
      .then((items) =>
        items
          .filter((item) => item[4].includes('GP'))
          .map((item) => ({
            type: AssetType.STOCK_CN,
            id: item[1],
            name: unescapeUnicode(item[2]),
            label: item[1],
          })),
      ),
    fetch(
      `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(keyword)}&t=us`,
      {},
    )
      .then((response) => response.text())
      .then(parseText)
      .then((items) =>
        items.map((item) => ({
          type: AssetType.STOCK_US,
          id: item[1].split('.')[0].toUpperCase(),
          name: unescapeUnicode(item[2]),
          label: item[1].split('.')[0].toUpperCase(),
        })),
      ),
    fetch(
      `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(keyword)}&t=hk`,
      {},
    )
      .then((response) => response.text())
      .then(parseText)
      .then((items) =>
        items.map((item) => ({
          type: AssetType.STOCK_HK,
          id: item[1],
          name: unescapeUnicode(item[2]),
          label: item[1],
        })),
      ),
    fetch(
      `https://smartbox.gtimg.cn/s3/?v=2&q=${encodeURIComponent(keyword)}&t=jj`,
      {},
    )
      .then((response) => response.text())
      .then(parseText)
      .then((items) =>
        items.map((item) => ({
          type: AssetType.FUND,
          id: item[1],
          name: unescapeUnicode(item[2]),
          label: item[1],
        })),
      ),
  ])
  res.status(200).json(flatten(list))
}
