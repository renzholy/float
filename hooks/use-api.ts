import { useMemo } from 'react'
import useSWR from 'swr'

export enum ItemType {
  EXCHANGE = 'EXCHANGE',
  COIN = 'COIN',
  STOCK = 'STOCK',
  FUND = 'FUND',
}

export function useAllItems() {
  const { data: exchanges } = useSWR<{ rates: { [name: string]: number } }>(
    'exchanges',
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
      [type in ItemType]: {
        type: ItemType
        id: string
        name?: string
        shortcut?: string
      }[]
    }
  >(
    () => ({
      [ItemType.EXCHANGE]: exchanges
        ? Object.keys(exchanges.rates).map((rate) => ({
            type: ItemType.EXCHANGE,
            id: rate,
          }))
        : [],
      [ItemType.COIN]:
        coins?.map((coin) => ({
          type: ItemType.COIN,
          id: coin.id,
          name: coin.name,
          shortcut: coin.symbol,
        })) || [],
      [ItemType.STOCK]:
        stocks?.data.map((stock) => ({
          type: ItemType.STOCK,
          id: stock[0],
          name: stock[1],
        })) || [],
      [ItemType.FUND]:
        funds?.data.map((fund) => ({
          type: ItemType.FUND,
          id: fund[0],
          name: fund[2],
          shortcut: fund[1],
        })) || [],
    }),
    [exchanges, coins, stocks, funds],
  )
}

export function usePrice(base: string, type: ItemType, id: string) {
  const { data: exchanges } = useSWR<{ rates: { [name: string]: number } }>(
    ['exchanges', base],
    () =>
      fetch(
        `https://api.ratesapi.io/api/latest?base=${base}`,
      ).then((response) => response.json()),
  )
  const { data } = useSWR<number>(
    exchanges ? ['price', type, id, exchanges] : null,
    () => {
      if (type === ItemType.EXCHANGE) {
        return exchanges!.rates[type.toUpperCase()]
      }
      if (type === ItemType.COIN) {
        return fetch(`https://api.coinpaprika.com/v1/coins/${id}/ohlcv/today`)
          .then((response) => response.json())
          .then(
            (json: [{ close: number }]) => json[0].close / exchanges!.rates.USD,
          )
      }
      if (type === ItemType.STOCK) {
        return fetch(`https://api.doctorxiong.club/v1/stock?code=${id}`)
          .then((response) => response.json())
          .then(
            (json: { data: [{ netWorth: number }] }) =>
              json.data[0].netWorth / exchanges!.rates[base],
          )
      }
      if (type === ItemType.FUND) {
        return fetch(`https://api.doctorxiong.club/v1/fund?code=${id}`)
          .then((response) => response.json())
          .then(
            (json: { data: [{ price: number }] }) =>
              json.data[0].price / exchanges!.rates[base],
          )
      }
      return 0
    },
  )
  return data || 0
}
