import * as Comlink from 'comlink'

import db from '../libs/db'
import { Asset } from '../libs/types'

export interface WorkerApi {
  bulkPut: typeof db['assets']['bulkPut']
  search(keyword: string): Promise<Asset[]>
}

const workerApi: WorkerApi = {
  bulkPut: db.assets.bulkPut.bind(db.assets),
  search(keyword: string) {
    return db.assets
      .where('name')
      .startsWithIgnoreCase(keyword)
      .or('symbol')
      .equalsIgnoreCase(keyword)
      .limit(20)
      .toArray()
  },
}

Comlink.expose(workerApi)
