import { css } from 'linaria'
import { useState } from 'react'

import { Price } from '../components/price'
import { ItemType, useAllItems } from '../hooks/use-api'

const splitter = '|'

export default function Index() {
  const [amount, setAmount] = useState(0)
  const [unit, setUnit] = useState('')
  const [list, setList] = useState<
    { amount: number; type: ItemType; id: string }[]
  >([])
  const items = useAllItems()

  return (
    <div>
      <form>
        <select
          value={unit}
          onChange={(e) => {
            setUnit(e.target.value)
          }}
          className={css`
            height: 32px;
          `}>
          <option value="" disabled={true}>
            select unit
          </option>
          {Object.entries(items).map(([type, group]) => (
            <optgroup key={type} label={type}>
              {group.map((item) => (
                <option
                  key={`${item.type}${splitter}${item.id}`}
                  value={`${item.type}${splitter}${item.id}`}>
                  {item.id} {item.name} {item.shortcut}
                </option>
              ))}
            </optgroup>
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
            const [type, id] = unit.split(splitter) as [ItemType, string]
            setList((old) => [{ amount, type, id }, ...old])
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
          </li>
        ))}
      </ul>
    </div>
  )
}
