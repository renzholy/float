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

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { db } from '../libs/db'
import { Asset } from '../libs/types'

const splitter = '|'

const AssetSuggest = Suggest.ofType<Asset>()

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState<Asset | null>(null)
  const { data } = useSWR(keyword ? ['asset', keyword] : null, () =>
    db.assets
      .where('name')
      .startsWithIgnoreCase(keyword)
      .or('symbol')
      .equalsIgnoreCase(keyword)
      .toArray(),
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
              text={item.name}
              label={item.symbol}
              onClick={handleClick}
              disabled={modifiers.disabled}
              active={modifiers.active}
            />
          )}
          selectedItem={asset}
          activeItem={asset}
          itemPredicate={() => true}
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
              key={`${item.type}${splitter}${item.id}`}
              onClick={() => {
                setList((old) =>
                  old.filter((i) => i.type !== item.type || i.id !== item.id),
                )
              }}
              text={
                <Price amount={item.amount} type={item.type} id={item.id} />
              }
              label={item.name}
            />
          ))}
        </Menu>
      ) : null}
    </div>
  )
}
