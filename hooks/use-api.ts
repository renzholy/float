import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import * as Comlink from 'comlink'

import { Asset, AssetType } from '../libs/types'
import { WorkerApi } from '../workers/db.worker'

export function useSearch(keyword: string) {
  return useSWR<{ [key in AssetType]?: Asset[] }>(
    keyword ? ['search', keyword] : null,
    async () => {
      const results = await Promise.all([
        fetch(
          `/api/search?keyword=${encodeURIComponent(keyword)}`,
        ).then((response) => response.json()),
      ])
      console.log(results)
      return {}
    },
  )
}

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

  const { data: cryptos } = useSWR<
    { id: string; name: string; symbol: string; is_active: boolean }[]
  >(
    'cryptos',
    () =>
      fetch('https://api.coinpaprika.com/v1/coins').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  useEffect(() => {
    if (cryptos) {
      comlinkWorkerRef.current?.bulkPut(
        cryptos
          .filter((crypto) => crypto.is_active)
          .map((crypto) => ({
            type: AssetType.CRYPTO,
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
          })),
      )
    }
  }, [cryptos])

  const { data: stocksCN } = useSWR<{
    data: [string, string][]
  }>(
    'stocksCN',
    () =>
      fetch('https://api.doctorxiong.club/v1/stock/all').then((response) =>
        response.json(),
      ),
    { revalidateOnFocus: false },
  )
  useEffect(() => {
    if (stocksCN) {
      comlinkWorkerRef.current?.bulkPut(
        stocksCN.data.map((stock) => ({
          type: AssetType.STOCK_CN,
          id: stock[0],
          name: stock[1] || '',
          symbol: stock[0],
        })),
      )
    }
  }, [stocksCN])

  const { data: stocksHK } = useSWR<
    { id: string; name: string; symbol: string }[]
  >('stocksHK', () => import('../data/hk.json').then(({ default: hk }) => hk), {
    revalidateOnFocus: false,
  })
  useEffect(() => {
    if (stocksHK) {
      comlinkWorkerRef.current?.bulkPut(
        stocksHK.map((stock) => ({
          type: AssetType.STOCK_HK,
          ...stock,
        })),
      )
    }
  }, [stocksHK])

  const { data: stocksUS } = useSWR<
    { id: string; name: string; symbol: string }[]
  >('stocksUS', () => import('../data/us.json').then(({ default: hk }) => hk), {
    revalidateOnFocus: false,
  })
  useEffect(() => {
    if (stocksUS) {
      comlinkWorkerRef.current?.bulkPut(
        stocksUS.map((stock) => ({
          type: AssetType.STOCK_US,
          ...stock,
        })),
      )
    }
  }, [stocksUS])

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
    if (funds) {
      comlinkWorkerRef.current?.bulkPut(
        funds.data.map((fund) => ({
          type: AssetType.FUND,
          id: fund[0],
          name: fund[2],
          symbol: fund[0],
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
        return fetch(`https://api.doctorxiong.club/v1/fund?code=${id}`)
          .then((response) => response.json())
          .then(
            (json: { data: [{ netWorth: string }] }) =>
              parseFloat(json.data[0].netWorth) / rates!.rates[base],
          )
      }
      return NaN
    },
  )
  return data || NaN
}
