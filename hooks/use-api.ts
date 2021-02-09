import { useEffect } from 'react'
import useSWR from 'swr'

import { db } from '../libs/db'
import { segment } from '../libs/segment'
import { AssetType } from '../libs/types'

export function useAllItems() {
  const { data: forexs } = useSWR<{ rates: { [name: string]: number } }>(
    'forexs',
    () =>
      fetch('https://api.ratesapi.io/api/latest').then((response) =>
        response.json(),
      ),
  )
  const { data: cryptos } = useSWR<
    { id: string; name: string; symbol: string }[]
  >('cryptos', () =>
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
  useEffect(() => {
    if (forexs) {
      db.assets.bulkPut(
        Object.keys(forexs.rates).map((rate) => ({
          type: AssetType.FOREX,
          id: rate,
          name: rate,
          segments: [rate],
          length: rate.length,
        })),
      )
    }
  }, [forexs])
  useEffect(() => {
    if (cryptos) {
      db.assets.bulkPut(
        cryptos.map((crypto) => ({
          type: AssetType.CRYPTO,
          id: crypto.id,
          name: crypto.name,
          segments: [...segment(crypto.symbol), ...segment(crypto.name)],
          length: crypto.name.length,
        })),
      )
    }
  }, [cryptos])
  useEffect(() => {
    if (stocks) {
      db.assets.bulkPut(
        stocks.data.map((stock) => ({
          type: AssetType.STOCK_CN,
          id: stock[0],
          name: stock[1],
          segments: segment(stock[1]),
          length: stock[1]?.length || 0,
        })),
      )
    }
  }, [stocks])
  useEffect(() => {
    if (funds) {
      db.assets.bulkPut(
        funds.data.map((fund) => ({
          type: AssetType.FUND,
          id: fund[0],
          name: fund[2],
          segments: [...segment(fund[1]), ...segment(fund[2])],
          length: fund[2].length,
        })),
      )
    }
  }, [funds])
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
