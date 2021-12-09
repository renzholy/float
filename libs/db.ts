/* eslint-disable no-param-reassign */

import Dexie from 'dexie'

import { Item, ItemType } from './types'

class FloatDatabase extends Dexie {
  items: Dexie.Table<Item, [ItemType, string]>

  constructor() {
    super('FloatDatabase')
    this.version(1).stores({
      items: '[type+id]',
    })
    this.version(2).stores({
      items: '[type+id]',
      config: '&key',
    })
    this.version(3).stores({
      items: '&[type+id]',
      config: null,
    })
    this.version(4)
      .stores({
        items: '&[type+id]',
      })
      .upgrade((trans) =>
        trans
          .table<Item, [ItemType, string]>('items')
          .toCollection()
          .modify((obj) => {
            obj.currency = 'CNY'
          }),
      )
    this.items = this.table('items')
  }
}

const db = new FloatDatabase()

export default db
