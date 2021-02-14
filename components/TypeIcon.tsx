import { css } from '@linaria/core'
import {
  RiExchangeLine,
  RiBitCoinLine,
  RiFundsLine,
  RiExchangeFundsLine,
} from 'react-icons/ri'

import { AssetType } from '../libs/types'

const iconClassName = css`
  fill: #5c7080;
  margin-top: 2px;
  margin-right: 7px;
`

const iconLargeClassName = css`
  fill: #5c7080;
  margin-top: 1px;
  margin-right: 7px;
`

export function TypeIcon(props: { type: AssetType; large?: boolean }) {
  const className = props.large ? iconLargeClassName : iconClassName
  const size = props.large ? 20 : 16
  return {
    [AssetType.FOREX]: <RiExchangeLine size={size} className={className} />,
    [AssetType.CRYPTO]: <RiBitCoinLine size={size} className={className} />,
    [AssetType.STOCK_CN]: <RiFundsLine size={size} className={className} />,
    [AssetType.STOCK_HK]: <RiFundsLine size={size} className={className} />,
    [AssetType.STOCK_US]: <RiFundsLine size={size} className={className} />,
    [AssetType.FUND]: <RiExchangeFundsLine size={size} className={className} />,
  }[props.type]
}
