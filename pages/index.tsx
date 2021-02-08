import { useState } from 'react'

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
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(parseFloat(e.target.value))
          }}
          placeholder="amount"
        />
        <select
          value={unit}
          onChange={(e) => {
            setUnit(e.target.value)
          }}>
          <option value="" disabled={true}>
            select unit
          </option>
          {Object.entries(items).map(([type, group]) => (
            <optgroup key={type} label={type}>
              {group.map((item) => (
                <option
                  key={`${item.type}${splitter}${item.id}`}
                  value={`${item.type}${splitter}${item.id}`}>
                  {item.id} {item.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const [type, id] = unit.split(splitter) as [ItemType, string]
            setList((old) => [{ amount, type, id }, ...old])
          }}>
          ADD
        </button>
      </form>
      <ul>
        {list.map((item) => (
          <li key={`${item.type}${splitter}${item.id}`}>
            {item.type} {item.id} {item.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}
