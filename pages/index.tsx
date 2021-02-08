import { css } from 'linaria'
import { useState } from 'react'
import useSWR from 'swr'

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { db } from '../libs/db'
import { AssetType } from '../libs/types'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState(0)
  const [type, setType] = useState<AssetType | ''>('')
  const [id, setId] = useState('')
  const { data } = useSWR(['asset', type, keyword], () =>
    db.assets
      .where('type')
      .equals(type)
      .filter(
        (item) =>
          !!(
            !keyword ||
            item.name?.includes(keyword) ||
            item.shortcut?.includes(keyword)
          ),
      )
      .toArray(),
  )
  const [list, setList] = useState<
    { amount: number; type: AssetType; id: string }[]
  >([])
  useAllItems()

  return (
    <div>
      <form>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as AssetType)
          }}
          className={css`
            height: 32px;
          `}>
          <option value="">select type</option>
          {Object.entries(AssetType).map((asset) => (
            <option key={asset[0]}>{asset[1]}</option>
          ))}
        </select>
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
          value={id}
          onChange={(e) => {
            setId(e.target.value)
          }}
          className={css`
            height: 32px;
          `}>
          <option value="" disabled={true}>
            select unit
          </option>
          {data?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} {item.name} {item.shortcut}
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
            if (type) {
              setList((old) => [{ amount, type, id }, ...old])
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
          <li key={item.id}>
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
