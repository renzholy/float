import Dexie from 'dexie/dist/dexie'

import { Item } from './types'

class FloatDatabase extends Dexie {
  items: Dexie.Table<Item, number>

  constructor() {
    super('FloatDatabase')
    this.version(1).stores({
      items: '++order',
    })

    this.items = this.table('items')
  }
}

const db = new FloatDatabase()

export default db
