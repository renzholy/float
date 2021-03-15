import { useEffect } from 'react'

import { usePrice } from '../hooks/use-price'
import { formatNumber } from '../libs/formatter'
import { ItemType } from '../libs/types'

export function Price(props: {
  amount: number
  type: ItemType
  id: string
  onPrice(price: number): void
}) {
  const price = usePrice('CNY', props.type, props.id)
  const { onPrice } = props
  useEffect(() => {
    onPrice(price)
  }, [onPrice, price])

  return <>{formatNumber(price * props.amount)}</>
}