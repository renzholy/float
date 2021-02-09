import { useEffect } from 'react'
import { usePrice } from '../hooks/use-api'
import { numberFormat } from '../libs/formatter'
import { AssetType } from '../libs/types'

export function Price(props: {
  amount: number
  type: AssetType
  id: string
  onPrice(price: number): void
}) {
  const price = usePrice('CNY', props.type, props.id)
  const { onPrice } = props
  useEffect(() => {
    onPrice(price)
  }, [onPrice, price])

  return <>{numberFormat.format(price * props.amount)}</>
}
