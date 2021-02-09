import { css } from 'linaria'
import { useState } from 'react'
import useSWR from 'swr'
import { Suggest } from '@blueprintjs/select'
import { MenuItem, NumericInput, Button } from '@blueprintjs/core'

import { Price } from '../components/price'
import { useAllItems } from '../hooks/use-api'
import { db } from '../libs/db'
import { Asset, AssetType } from '../libs/types'

const splitter = '|'

const AssetSuggest = Suggest.ofType<Asset>()

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState(0)
  const [asset, setAsset] = useState<Asset>()
  const { data } = useSWR(keyword ? ['asset', keyword] : null, () =>
    db.assets
      .where('name')
      .startsWithIgnoreCase(keyword)
      .or('symbol')
      .equalsIgnoreCase(keyword)
      .toArray(),
  )
  const [list, setList] = useState<
    { amount: number; type: AssetType; id: string }[]
  >([])
  useAllItems()

  return (
    <div>
      <div
        className={css`
          display: flex;
          margin: 5px;
        `}>
        <AssetSuggest
          inputProps={{ large: true }}
          className={css`
            margin: 5px;
          `}
          query={keyword}
          onQueryChange={setKeyword}
          items={data || []}
          noResults={<MenuItem disabled={true} text="No results." />}
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
        <NumericInput
          large={true}
          className={css`
            margin: 5px;
          `}
          value={amount}
          onValueChange={setAmount}
          placeholder="Amount"
          buttonPosition="none"
        />
        <Button
          large={true}
          className={css`
            margin: 5px;
          `}
          onClick={() => {
            if (asset && amount) {
              setList((old) => [
                { amount, type: asset.type, id: asset.id },
                ...old,
              ])
              setAmount(0)
              setAsset(undefined)
            }
          }}>
          ADD
        </Button>
      </div>
      <ul>
        {list.map((item) => (
          <li key={`${item.type}${splitter}${item.id}`}>
            {item.type} {item.id} {item.amount}&nbsp;
            <Price amount={item.amount} type={item.type} id={item.id} />
            <button
              type="button"
              onClick={() => {
                setList((old) =>
                  old.filter((i) => i.type !== item.type || i.id !== item.id),
                )
              }}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
