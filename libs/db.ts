import Dexie from 'dexie/dist/dexie'

import { Asset } from './types'

class MyDatabase extends Dexie {
  assets: Dexie.Table<Asset, string>

  mine: Dexie.Table<Asset & { amount: number; order: number }, number>

  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      assets: '&[type+id], name, symbol',
      mine: '++order',
    })
    this.assets = this.table('assets')
    this.mine = this.table('mine')
  }
}

const db = new MyDatabase()

export default db
