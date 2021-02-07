import { useMemo } from 'react'
import useSWR from 'swr'

enum ItemType {
  COIN,
  STOCK,
  FUND,
  EXCHANGE,
}

export function useSearchIndex() {
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
  const { data: exchanges } = useSWR<{ rates: { [name: string]: number } }>(
    'exchanges',
    () =>
      fetch('https://api.ratesapi.io/api/latest?base=CNY').then((response) =>
        response.json(),
      ),
  )
  return useMemo<
    {
      type: ItemType
      id: string
      name?: string
      shortcut?: string
    }[]
  >(
    () =>
      coins && stocks && funds && exchanges
        ? [
            ...coins.map((coin) => ({
              type: ItemType.COIN,
              id: coin.id,
              name: coin.name,
              shortcut: coin.symbol,
            })),
            ...stocks.data.map((stock) => ({
              type: ItemType.STOCK,
              id: stock[0],
              name: stock[1],
            })),
            ...funds.data.map((fund) => ({
              type: ItemType.FUND,
              id: fund[0],
              name: fund[2],
              shortcut: fund[1],
            })),
            ...Object.keys(exchanges.rates).map((rate) => ({
              type: ItemType.EXCHANGE,
              id: rate,
            })),
          ]
        : [],
    [coins, stocks, funds, exchanges],
  )
}
