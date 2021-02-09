import { css, cx } from 'linaria'
import { useEffect, useRef, useState } from 'react'
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
  RiMoneyCnyCircleLine,
  RiStockLine,
} from 'react-icons/ri'
import * as Comlink from 'comlink'
import produce from 'immer'
import sum from 'lodash/sum'

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { Asset, AssetType } from '../libs/types'
import type { WorkerApi } from '../workers/db.worker'
import { formatNumber } from '../libs/formatter'
import db from '../libs/db'

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
  const workerRef = useRef<Worker>()
  const comlinkWorkerRef = useRef<Comlink.Remote<WorkerApi>>()
  useEffect(() => {
    workerRef.current = new Worker('../workers/db.worker', {
      type: 'module',
    })
    comlinkWorkerRef.current = Comlink.wrap<WorkerApi>(workerRef.current)
    return workerRef.current?.terminate
  }, [])
  const { data } = useSWR(['asset', keyword], async () =>
    keyword ? comlinkWorkerRef.current?.search?.(keyword) : [],
  )
  const { data: mine, revalidate } = useSWR('mine', () =>
    db.mine.orderBy('order').reverse().toArray(),
  )
  const [total, setTotal] = useState<number[]>([])
  useAllItems()

  return (
    <div
      className={css`
        max-width: 500px;
        margin: 0 auto;
      `}>
      <div
        className={css`
          display: flex;
          margin: 5px;
        `}>
        <AssetSuggest
          inputProps={{
            large: true,
            placeholder: 'Forex, Stock, Fund, Crypto',
            autoFocus: true,
          }}
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
              key={item.type + item.id}
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
          onClick={async () => {
            if (asset && amount && mine) {
              setAmount('')
              setAsset(null)
              await db.mine.add({
                amount: parseFloat(amount),
                ...asset,
                order: mine.length,
              })
              await revalidate()
            }
          }}>
          Add
        </Button>
      </div>
      <Menu
        large={true}
        className={cx(
          css`
            margin: 10px;
          `,
          Classes.ELEVATION_1,
        )}>
        {mine?.map((item, index) => (
          <MenuItem
            key={item.type + item.id}
            icon={icons(item.type, true)}
            text={
              <Price
                amount={item.amount}
                type={item.type}
                id={item.id}
                onPrice={(price) => {
                  setTotal((old) =>
                    produce(old, (draft) => {
                      // eslint-disable-next-line no-param-reassign
                      draft[index] = price * item.amount
                    }),
                  )
                }}
              />
            }
            label={item.name}>
            <MenuItem
              icon="trash"
              intent={Intent.DANGER}
              onClick={async () => {
                await db.mine.delete(item.order)
                await revalidate()
              }}
              text="Remove"
            />
          </MenuItem>
        ))}
        <MenuItem
          icon={
            <RiMoneyCnyCircleLine size={20} className={iconLargeClassName} />
          }
          text={formatNumber(sum(total))}
          label="Total"
        />
      </Menu>
    </div>
  )
}
