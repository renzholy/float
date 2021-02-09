import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import * as Comlink from 'comlink'

import { AssetType } from '../libs/types'
import { WorkerApi } from '../workers/db.worker'

export function useAllItems() {
  const workerRef = useRef<Worker>()
  const comlinkWorkerRef = useRef<Comlink.Remote<WorkerApi>>()
  useEffect(() => {
    workerRef.current = new Worker('../workers/db.worker', { type: 'module' })
    comlinkWorkerRef.current = Comlink.wrap<WorkerApi>(workerRef.current)
    return workerRef.current?.terminate
  }, [])
  const { data: forexs } = useSWR<{ rates: { [name: string]: number } }>(
    'forexs',
    () =>
      fetch('https://api.ratesapi.io/api/latest').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  const { data: cryptos } = useSWR<
    { id: string; name: string; symbol: string }[]
  >(
    'cryptos',
    () =>
      fetch('https://api.coinpaprika.com/v1/coins').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  const { data: stocks } = useSWR<{
    data: [string, string][]
  }>(
    'stocks',
    () =>
      fetch('https://api.doctorxiong.club/v1/stock/all').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  const { data: funds } = useSWR<{
    data: [string, string, string, string, string][]
  }>(
    'funds',
    () =>
      fetch('https://api.doctorxiong.club/v1/fund/all').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  useEffect(() => {
    if (forexs) {
      comlinkWorkerRef.current?.bulkPut(
        Object.keys(forexs.rates).map((rate) => ({
          type: AssetType.FOREX,
          id: rate,
          name: rate,
          symbol: rate,
        })),
      )
    }
  }, [forexs])
  useEffect(() => {
    if (cryptos) {
      comlinkWorkerRef.current?.bulkPut(
        cryptos.map((crypto) => ({
          type: AssetType.CRYPTO,
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
        })),
      )
    }
  }, [cryptos])
  useEffect(() => {
    if (stocks) {
      comlinkWorkerRef.current?.bulkPut(
        stocks.data.map((stock) => ({
          type: AssetType.STOCK_CN,
          id: stock[0],
          name: stock[1] || '',
          symbol: stock[0],
        })),
      )
    }
  }, [stocks])
  useEffect(() => {
    if (funds) {
      comlinkWorkerRef.current?.bulkPut(
        funds.data.map((fund) => ({
          type: AssetType.FUND,
          id: fund[0],
          name: fund[2],
          symbol: fund[1],
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
