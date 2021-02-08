import { ItemType, usePrice } from '../hooks/use-api'

export function Price(props: { amount: number; type: ItemType; id: string }) {
  const price = usePrice('CNY', props.type, props.id)
  return <span>{price * props.amount}</span>
}
