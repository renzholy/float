import { useState } from 'react'
import useSWR from 'swr'

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const { data: coins } = useSWR<
    { id: string; name: string; symbol: string }[]
  >('coins', () =>
    fetch(`https://api.coinpaprika.com/v1/coins`).then((response) =>
      response.json(),
    ),
  )
  const { data: stocks } = useSWR<{ data: [string, string][] }>('stocks', () =>
    fetch(`https://api.doctorxiong.club/v1/stock/all`).then((response) =>
      response.json(),
    ),
  )
  const { data: funds } = useSWR<{
    data: [string, string, string, string, string][]
  }>('funds', () =>
    fetch(`https://api.doctorxiong.club/v1/fund/all`).then((response) =>
      response.json(),
    ),
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
      <ul>
        {coins?.map((coin) => (
          <li key={coin.id}>
            <button type="button">
              {coin.symbol} {coin.name}
            </button>
          </li>
        ))}
        {stocks?.data?.map((stock) => (
          <li key={stock[0]}>
            <button type="button">
              {stock[0]} {stock[1]}
            </button>
          </li>
        ))}
        {funds?.data?.map((fund) => (
          <li key={fund[0]}>
            <button type="button">
              {fund[0]} {fund[2]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
