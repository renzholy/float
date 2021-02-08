import { useState } from 'react'

import { useAllItems } from '../hooks/use-api'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const items = useAllItems()

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        placeholder="search"
      />
      <select>
        {Object.entries(items).map(([type, group]) => (
          <optgroup key={type} label={type}>
            {group.map((item) => (
              <option key={item.type + item.id} value={item.type + item.id}>
                {item.id} {item.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
