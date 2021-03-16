import Dexie from 'dexie/dist/dexie'

import { Item, ItemType } from './types'

class FloatDatabase extends Dexie {
  items: Dexie.Table<Item, [ItemType, string]>

  config: Dexie.Table<
    | { key: 'inverseColor'; value: boolean }
    | { key: 'hidePrice'; value: boolean }
    | { key: 'largeFont'; value: boolean },
    string
  >

  constructor() {
    super('FloatDatabase')
    this.version(1).stores({
      items: '[type+id]',
    })
    this.version(2).stores({
      items: '[type+id]',
      config: '&key',
    })
    this.items = this.table('items')
    this.config = this.table('config')
  }
}

const db = new FloatDatabase()

export default db
