import { useMemo } from 'react'
import useSWR from 'swr'

import { ItemType, SearchItem } from '../libs/types'

function useSearchServer(keyword: string) {
  return useSWR<SearchItem[]>(
    keyword ? ['searchServer', keyword] : null,
    async () =>
      fetch(
        `${
          'chrome' in window ? 'https://float.watch' : ''
        }/api/search?keyword=${encodeURIComponent(keyword)}`,
      ).then((response) => response.json()),
    {
      revalidateOnFocus: false,
    },
  )
}

function useSearchClient(keyword: string) {
  return useSWR<SearchItem[]>(
    keyword ? ['searchClient', keyword] : null,
    async () =>
      fetch(
        `https://api.coinpaprika.com/v1/search?c=currencies&q=${encodeURIComponent(
          keyword,
        )}`,
      )
        .then((response) => response.json())
        .then((json) =>
          json.currencies.map(
            (item: { id: string; name: string; symbol: string }) => ({
              id: item.id,
              type: ItemType.CRYPTO,
              code: item.symbol,
              name: item.name,
            }),
          ),
        ),
    {
      revalidateOnFocus: false,
    },
  )
}

function useSearchLocal(keyword: string): SearchItem[] {
  return keyword
    ? Object.entries({
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
          type: ItemType.FOREX,
          id: item[0],
          code: item[0],
          name: item[1],
        }))
        .filter(
          (item) =>
            item.id === keyword.toUpperCase() || item.name.includes(keyword),
        )
    : []
}

export function useSearch(keyword: string): {
  data: SearchItem[]
  isValidating: boolean
} {
  const { data: serverData = [], isValidating: serverIsValidating } =
    useSearchServer(keyword)
  const { data: clientData = [], isValidating: clientIsValidating } =
    useSearchClient(keyword)
  const localData = useSearchLocal(keyword)
  const data = useMemo(
    () => [
      ...localData,
      ...serverData,
      ...clientData,
      ...(keyword
        ? [
            {
              type: ItemType.CUSTOM,
              id: keyword,
              code: '',
              name: keyword,
            },
          ]
        : []),
    ],
    [localData, serverData, clientData, keyword],
  )
  const isValidating = useMemo(
    () => serverIsValidating || clientIsValidating,
    [serverIsValidating, clientIsValidating],
  )
  return { data, isValidating }
}
