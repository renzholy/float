import { css, cx } from 'linaria'
import { useState } from 'react'
import useSWR from 'swr'
import { Suggest } from '@blueprintjs/select'
import {
  MenuItem,
  Button,
  Menu,
  Classes,
  Intent,
  InputGroup,
} from '@blueprintjs/core'
import {
  RiBitCoinLine,
  RiExchangeLine,
  RiFundsLine,
  RiStockLine,
} from 'react-icons/ri'

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { db } from '../libs/db'
import { Asset, AssetType } from '../libs/types'

const AssetSuggest = Suggest.ofType<Asset>()

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

function icons(type: AssetType, large?: boolean) {
  const className = large ? iconLargeClassName : iconClassName
  const size = large ? 20 : 16
  return {
    [AssetType.FOREX]: <RiExchangeLine size={size} className={className} />,
    [AssetType.CRYPTO]: <RiBitCoinLine size={size} className={className} />,
    [AssetType.STOCK_CN]: <RiStockLine size={size} className={className} />,
    [AssetType.STOCK_HK]: <RiStockLine size={size} className={className} />,
    [AssetType.STOCK_US]: <RiStockLine size={size} className={className} />,
    [AssetType.FUND]: <RiFundsLine size={size} className={className} />,
  }[type]
}

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState<Asset | null>(null)
  const { data } = useSWR(['asset', keyword], () =>
    keyword
      ? db.assets
          .where('name')
          .startsWithIgnoreCase(keyword)
          .or('symbol')
          .equalsIgnoreCase(keyword)
          .limit(20)
          .toArray()
      : [],
  )
  const [list, setList] = useState<({ amount: number } & Asset)[]>([])
  useAllItems()

  return (
    <div
      className={css`
        width: 400px;
        margin: 0 auto;
      `}>
      <div
        className={css`
          display: flex;
          margin: 5px;
        `}>
        <AssetSuggest
          inputProps={{ large: true }}
          fill={true}
          className={css`
            margin: 5px;
          `}
          query={keyword}
          onQueryChange={setKeyword}
          items={data || []}
          noResults={
            keyword ? (
              <MenuItem disabled={true} text="No results." />
            ) : undefined
          }
          inputValueRenderer={(item) => item.name}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              icon={icons(item.type)}
              text={item.name}
              label={item.symbol}
              onClick={handleClick}
              disabled={modifiers.disabled}
              active={modifiers.active}
            />
          )}
          selectedItem={asset}
          activeItem={asset}
          itemListPredicate={(_q, items) => items}
          onItemSelect={setAsset}
          openOnKeyDown={true}
          popoverProps={{
            minimal: true,
            popoverClassName: css`
              max-height: 400px;
              overflow-y: auto;
            `,
          }}
        />
        <InputGroup
          large={true}
          className={css`
            margin: 5px;
            width: 80px;
            flex-shrink: 0;
          `}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          placeholder="Amount"
        />
        <Button
          large={true}
          className={css`
            margin: 5px;
          `}
          disabled={!asset || !amount}
          intent={Intent.PRIMARY}
          onClick={() => {
            if (asset && amount) {
              setList((old) => [
                { amount: parseFloat(amount), ...asset },
                ...old,
              ])
              setAmount('')
              setAsset(null)
            }
          }}>
          Add
        </Button>
      </div>
      {list.length ? (
        <Menu
          large={true}
          className={cx(
            css`
              margin: 10px;
            `,
            Classes.ELEVATION_1,
          )}>
          {list.map((item) => (
            <MenuItem
              key={item.type + item.id}
              icon={icons(item.type, true)}
              text={
                <Price amount={item.amount} type={item.type} id={item.id} />
              }
              label={item.name}>
              <MenuItem
                icon="trash"
                intent={Intent.DANGER}
                onClick={() => {
                  setList((old) =>
                    old.filter((i) => i.type !== item.type || i.id !== item.id),
                  )
                }}
                text="Remove"
              />
            </MenuItem>
          ))}
        </Menu>
      ) : null}
    </div>
  )
}
