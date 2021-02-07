import { useState } from 'react'

import { useSearchIndex } from '../hooks/use-api'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const items = useSearchIndex()

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        placeholder="search"
      />
      <ul>
        {items?.map((item) => (
          <li key={item.type + item.id}>
            <button type="button">
              {item.id} {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
