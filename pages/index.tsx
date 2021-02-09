import { css } from 'linaria'
import { useState } from 'react'
import useSWR from 'swr'

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { db } from '../libs/db'
import { AssetType } from '../libs/types'

const splitter = '|'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState(0)
  const [asset, setAsset] = useState('')
  const { data } = useSWR(keyword ? ['asset', keyword] : null, () =>
    db.assets
      .where('name')
      .startsWithIgnoreCase(keyword)
      .or('symbol')
      .equalsIgnoreCase(keyword)
      .toArray(),
  )
  const [list, setList] = useState<
    { amount: number; type: AssetType; id: string }[]
  >([])
  useAllItems()

  return (
    <div>
      <form>
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          placeholder="search"
          className={css`
            height: 26px;
          `}
        />
        <select
          value={asset}
          onChange={(e) => {
            setAsset(e.target.value)
          }}
          className={css`
            height: 32px;
          `}>
          <option value="" disabled={true}>
            select unit
          </option>
          {data?.map((item) => (
            <option
              key={`${item.type}${splitter}${item.id}`}
              value={`${item.type}${splitter}${item.id}`}>
              {item.type} {item.id} {item.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(parseFloat(e.target.value))
          }}
          placeholder="amount"
          className={css`
            height: 26px;
          `}
        />
        <button
          type="button"
          onClick={() => {
            const [type, id] = asset.split(splitter) as [AssetType, string]
            if (type && id && amount) {
              setList((old) => [{ amount, type, id }, ...old])
              setAmount(0)
              setAsset('')
            }
          }}
          className={css`
            height: 32px;
          `}>
          ADD
        </button>
      </form>
      <ul>
        {list.map((item) => (
          <li key={`${item.type}${splitter}${item.id}`}>
            {item.type} {item.id} {item.amount}&nbsp;
            <Price amount={item.amount} type={item.type} id={item.id} />
            <button
              type="button"
              onClick={() => {
                setList((old) =>
                  old.filter((i) => i.type !== item.type || i.id !== item.id),
                )
              }}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
