import Dexie from 'dexie/dist/dexie'

import { Asset } from './types'

class MyDatabase extends Dexie {
  assets: Dexie.Table<Asset, string>

  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      assets: '&[type+id], name, symbol',
    })
    this.assets = this.table('assets')
  }
}

const db = new MyDatabase()

export default db
