/* eslint-disable no-console */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */

import got from 'got'
import fs from 'fs'

import { Asset, AssetType } from '../libs/types'

async function runUS() {
  let page = 1
  const data: Asset[] = []

  while (true) {
    const json = await got(
      `https://stock.finance.sina.com.cn/usstock/api/json.php/US_CategoryService.getList?page=${page}`,
    ).json<{
      count: number
      data: {
        name: string
        cname: string
        symbol: string
      }[]
    }>()
    data.push(
      ...json.data.map((item) => ({
        type: AssetType.STOCK_US,
        id: item.symbol,
        name: item.cname.replace(/公司$/, ''),
        symbol: item.symbol,
      })),
    )
    console.log('us', page, data.length)
    if (json.data.length === 0) {
      fs.writeFileSync('./data/us.json', JSON.stringify(data, null, 2), 'utf8')
      break
    }
    page += 1
  }
}

async function runHK() {
  let page = 1
  const data = []

  while (true) {
    const json = await got(
      `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHKStockData?page=${page}&num=40&node=qbgg_hk`,
    ).json<
      {
        name: string
        engname: string
        symbol: string
      }[]
    >()
    data.push(
      ...json.map((item) => ({
        type: AssetType.STOCK_HK,
        id: item.symbol,
        name: item.name,
        symbol: item.symbol,
      })),
    )
    console.log('hk', page, data.length)
    if (json.length === 0) {
      fs.writeFileSync('./data/hk.json', JSON.stringify(data, null, 2), 'utf8')
      break
    }
    page += 1
  }
}

runUS()
runHK()
