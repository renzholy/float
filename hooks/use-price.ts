import { useEffect } from 'react'
import useSWR from 'swr'

import { Currency, ItemType } from '../libs/types'

export function usePrice(base: Currency, type: ItemType, id: string) {
  const { data: rates } = useSWR<{ [name: string]: number }>(
    ['exchanges', base],
    () =>
      fetch(
        `${
          'chrome' in window ? 'https://float.watch' : ''
        }/api/rates?base=${base}`,
      ).then((response) => response.json()),
    { refreshInterval: 10 * 1000 },
  )
  useEffect(() => {
    if (rates) {
      localStorage.setItem(
        'rates',
        JSON.stringify({
          CNY: rates.CNY,
          USD: rates.USD,
          HKD: rates.HKD,
        }),
      )
    }
  }, [rates])
  return useSWR<number | undefined>(
    rates ? ['price', type, id, rates] : null,
    () => {
      if (type === ItemType.FOREX) {
        return 1 / rates![id.toUpperCase()]
      }
      if (type === ItemType.CRYPTO) {
        return fetch(`https://api.coinpaprika.com/v1/coins/${id}/ohlcv/today`)
          .then((response) => response.json())
          .then((json: [{ close: number }]) => json[0].close / rates!.USD)
      }
      if (type === ItemType.STOCK_CN) {
        return fetch(`https://qt.gtimg.cn/q=${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]))
      }
      if (type === ItemType.STOCK_HK) {
        return fetch(`https://qt.gtimg.cn/q=hk${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]) / rates!.HKD)
      }
      if (type === ItemType.STOCK_US) {
        return fetch(`https://qt.gtimg.cn/q=us${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]) / rates!.USD)
      }
      if (type === ItemType.FUND) {
        return fetch(`https://qt.gtimg.cn/q=jj${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[5]))
      }
      if (type === ItemType.CUSTOM) {
        return undefined
      }
      return NaN
    },
    { refreshInterval: 10 * 1000 },
  )
}
