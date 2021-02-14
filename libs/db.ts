import Dexie from 'dexie/dist/dexie'

import { Asset } from './types'

class MyDatabase extends Dexie {
  mine: Dexie.Table<Asset & { amount: number; order?: number }, number>

  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      assets: '&[type+id], name, symbol',
      mine: '++order',
    })
    this.version(2).stores({
      assets: null,
      mine: '++order',
    })
    this.mine = this.table('mine')
  }
}

const db = new MyDatabase()

export default db
