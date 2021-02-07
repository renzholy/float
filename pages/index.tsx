import { useState } from 'react'
import useSWR from 'swr'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const { data } = useSWR<{
    currencies: {
      id: string
      name: string
      symbol: string
    }[]
  }>(['search', 'coin', keyword], () =>
    fetch(
      `https://api.coinpaprika.com/v1/search/?q=${encodeURIComponent(keyword)}`,
    ).then((response) => response.json()),
  )

  return (
    <div>
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        placeholder="search"
      />
      {data?.currencies.map((currency) => (
        <div key={currency.id}>{currency.name}</div>
      ))}
    </div>
  )
}
