import useSWR from 'swr'

import { AssetType } from '../libs/types'

export function usePrice(base: string, type: AssetType, id: string) {
  const { data: rates } = useSWR<{ rates: { [name: string]: number } }>(
    ['exchanges', base],
    () =>
      fetch(
        `https://api.ratesapi.io/api/latest?base=${base}`,
      ).then((response) => response.json()),
  )
  const { data } = useSWR<number>(
    rates ? ['price', type, id, rates] : null,
    () => {
      if (type === AssetType.FOREX) {
        return rates!.rates[type.toUpperCase()]
      }
      if (type === AssetType.CRYPTO) {
        return fetch(`https://api.coinpaprika.com/v1/coins/${id}/ohlcv/today`)
          .then((response) => response.json())
          .then((json: [{ close: number }]) => json[0].close / rates!.rates.USD)
      }
      if (type === AssetType.STOCK_CN) {
        return fetch(`https://qt.gtimg.cn/q=${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]))
      }
      if (type === AssetType.STOCK_HK) {
        return fetch(`https://qt.gtimg.cn/q=hk${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]) / rates!.rates.HKD)
      }
      if (type === AssetType.STOCK_US) {
        return fetch(`https://qt.gtimg.cn/q=us${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]) / rates!.rates.USD)
      }
      if (type === AssetType.FUND) {
        return fetch(`https://qt.gtimg.cn/q=jj${id}`)
          .then((response) => response.text())
          .then((text) => parseFloat(text.split('~')[3]))
      }
      return NaN
    },
  )
  return data || NaN
}
