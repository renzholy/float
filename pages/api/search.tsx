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
        items.map((item) => ({
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
    fetch(
      `https://api.coinpaprika.com/v1/search?c=currencies&q=${encodeURIComponent(
        keyword,
      )}`,
    )
      .then((response) => response.json())
      .then((json) =>
        json.currencies.map(
          (item: { id: string; name: string; symbol: string }) => ({
            type: AssetType.CRYPTO,
            id: item.id,
            name: item.name,
            label: item.symbol,
          }),
        ),
      ),
    Object.entries({
      GBP: '英镑',
      HKD: '港币',
      IDR: '印尼盾',
      ILS: '新锡克尔',
      DKK: '丹麦克朗',
      INR: '印度卢比',
      CHF: '瑞士法郎',
      MXN: '墨西哥比索',
      CZK: '捷克克朗',
      SGD: '新加坡元',
      THB: '泰铢',
      HRK: '克罗地亚库纳',
      MYR: '马来西亚林吉特',
      NOK: '挪威克朗',
      CNY: '人民币',
      BGN: '保加利亚列弗',
      PHP: '菲律宾比索',
      SEK: '瑞典克朗',
      PLN: '波兰兹罗提',
      ZAR: '南非兰特',
      CAD: '加拿大元',
      ISK: '冰岛克朗',
      BRL: '巴西雷亚尔',
      RON: '罗马尼亚列伊',
      NZD: '新西兰元',
      TRY: '土耳其里拉',
      JPY: '日元',
      RUB: '俄罗斯卢布',
      KRW: '韩元',
      USD: '美元',
      HUF: '匈牙利福林',
      AUD: '澳大利亚元',
    })
      .map((item) => ({
        type: AssetType.FOREX,
        id: item[0],
        name: item[1],
        label: item[0],
      }))
      .filter((item) => item.id === keyword || item.name.includes(keyword)),
  ])
  res.status(200).json(flatten(list))
}
