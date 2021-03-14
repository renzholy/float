import Dexie from 'dexie/dist/dexie'

import { Item, ItemType } from './types'

class FloatDatabase extends Dexie {
  items: Dexie.Table<Item, [ItemType, string]>

  constructor() {
    super('FloatDatabase')
    this.version(1).stores({
      items: '[type+id]',
    })
    this.items = this.table('items')
  }
}

const db = new FloatDatabase()

export default db
