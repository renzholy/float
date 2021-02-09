import Dexie from 'dexie'

import { AssetType } from './types'

class MyDatabase extends Dexie {
  assets: Dexie.Table<
    {
      type: AssetType
      id: string
      name: string
      segments: string[]
      length: number
    },
    string
  >

  constructor() {
    super('MyDatabase')
    this.version(1).stores({
      assets: '&[type+id], *segments, length',
    })
    this.assets = this.table('assets')
  }
}

export const db = new MyDatabase()
