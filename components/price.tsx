import { AssetType, usePrice } from '../hooks/use-api'

const numberFormat = Intl.NumberFormat()

export function Price(props: { amount: number; type: AssetType; id: string }) {
  const price = usePrice('CNY', props.type, props.id)
  return <span>{numberFormat.format(price * props.amount)}</span>
}