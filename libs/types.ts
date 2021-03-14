export enum ItemType {
  FOREX = '外汇',
  CRYPTO = '加密货币',
  STOCK_CN = 'A股',
  STOCK_HK = '港股',
  STOCK_US = '美股',
  FUND = '基金',
}

export interface SearchItem {
  type: ItemType
  id: string
  code: string
  name: string
}

export interface Item extends SearchItem {
  order: number
  amount?: number
  price?: number
  cost?: number
  comment?: string
}
