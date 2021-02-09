import * as Comlink from 'comlink'

import db from '../libs/db'

export interface WorkerApi {
  db: typeof db
}

const workerApi: WorkerApi = {
  db,
}

Comlink.expose(workerApi)
