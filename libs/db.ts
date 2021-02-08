import Dexie from 'dexie'

import { AssetType } from './types'

class MyDatabase extends Dexie {
  assets: Dexie.Table<
    {
      type: AssetType
      id: string
      name?: string
      shortcut?: string
    },
    string
  >

  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      assets: '&[type+id], type',
    })
    this.assets = this.table('assets')
  }
}

export const db = new MyDatabase()
