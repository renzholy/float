import { useEffect, useState } from 'react'

export function useRates() {
  const [rates, setRates] = useState({
    CNY: 1,
    HKD: 1.1948812549,
    USD: 0.1538461538,
  })
  useEffect(() => {
    const r = localStorage.getItem('rates')
    if (r) {
      try {
        setRates(JSON.parse(r))
      } catch (err) {
        console.error(err)
      }
    }
  }, [])
  return rates
}
