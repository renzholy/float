export enum AssetType {
  FOREX = '外汇',
  CRYPTO = '加密货币',
  STOCK_CN = 'A股',
  STOCK_HK = '港股',
  STOCK_US = '美股',
  FUND = '基金',
}

export interface Asset {
  type: AssetType
  id: string
  name: string
  symbol?: string
}
