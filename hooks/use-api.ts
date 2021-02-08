import { useMemo } from 'react'
import useSWR from 'swr'

export enum AssetType {
  FOREX = '外汇',
  CRYPTO = '加密货币',
  STOCK_CN = 'A股',
  STOCK_HK = '港股',
  STOCK_US = '美股',
  FUND = '基金',
}

export function useAllItems() {
  const { data: currencies } = useSWR<{ rates: { [name: string]: number } }>(
    'currencies',
    () =>
      fetch('https://api.ratesapi.io/api/latest').then((response) =>
        response.json(),
      ),
  )
  const { data: coins } = useSWR<
    { id: string; name: string; symbol: string }[]
  >('coins', () =>
    fetch('https://api.coinpaprika.com/v1/coins').then((response) =>
      response.json(),
    ),
  )
  const { data: stocks } = useSWR<{
    data: [string, string][]
  }>('stocks', () =>
    fetch('https://api.doctorxiong.club/v1/stock/all').then((response) =>
      response.json(),
    ),
  )
  const { data: funds } = useSWR<{
    data: [string, string, string, string, string][]
  }>('funds', () =>
    fetch('https://api.doctorxiong.club/v1/fund/all').then((response) =>
      response.json(),
    ),
  )

  return useMemo<
    {
      [type in AssetType]: {
        type: AssetType
        id: string
        name?: string
        shortcut?: string
      }[]
    }
  >(
    () => ({
      [AssetType.FOREX]: currencies
        ? Object.keys(currencies.rates).map((rate) => ({
            type: AssetType.FOREX,
            id: rate,
          }))
        : [],
      [AssetType.CRYPTO]:
        coins?.map((crypto) => ({
          type: AssetType.CRYPTO,
          id: crypto.id,
          name: crypto.name,
          shortcut: crypto.symbol,
        })) || [],
      [AssetType.STOCK_CN]:
        stocks?.data.map((stock) => ({
          type: AssetType.STOCK_CN,
          id: stock[0],
          name: stock[1],
        })) || [],
      [AssetType.STOCK_HK]: [],
      [AssetType.STOCK_US]: [],
      [AssetType.FUND]:
        funds?.data.map((fund) => ({
          type: AssetType.FUND,
          id: fund[0],
          name: fund[2],
          shortcut: fund[1],
        })) || [],
    }),
    [currencies, coins, stocks, funds],
  )
}

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
        return fetch(`https://api.doctorxiong.club/v1/stock?code=${id}`)
          .then((response) => response.json())
          .then(
            (json: { data: [{ price: string }] }) =>
              parseFloat(json.data[0].price) / rates!.rates[base],
          )
      }
      if (type === AssetType.FUND) {
        return fetch(`https://api.doctorxiong.club/v1/fund?code=${id}`)
          .then((response) => response.json())
          .then(
            (json: { data: [{ netWorth: string }] }) =>
              parseFloat(json.data[0].netWorth) / rates!.rates[base],
          )
      }
      return 0
    },
  )
  return data || 0
}
