import { usePrice } from '../hooks/use-api'
import { AssetType } from '../libs/types'

const numberFormat = Intl.NumberFormat()

export function Price(props: { amount: number; type: AssetType; id: string }) {
  const price = usePrice('CNY', props.type, props.id)
  return <span>{numberFormat.format(price * props.amount)}</span>
}
