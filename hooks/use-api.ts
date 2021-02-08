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
      fetch('https://api.ratesapi.io/api/latest?base=CNY').then((response) =>
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
