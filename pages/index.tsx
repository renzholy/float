import { css, cx } from '@linaria/core'
import { useState } from 'react'
import useSWR from 'swr'
import { Suggest } from '@blueprintjs/select'
import {
  MenuItem,
  Button,
  Classes,
  Intent,
  InputGroup,
} from '@blueprintjs/core'

import { Asset } from '../libs/types'
import db from '../libs/db'
import { useDarkMode } from '../hooks/use-dark-mode'
import { useSearch } from '../hooks/use-search'
import useDebounce from '../hooks/use-debounce'
import { TypeIcon } from '../components/TypeIcon'
import { Assets } from '../components/Assets'

const AssetSuggest = Suggest.ofType<Asset>()

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState<Asset | null>(null)
  const { data: mine, revalidate } = useSWR('mine', () =>
    db.mine.orderBy('order').reverse().toArray(),
  )
  const isDarkMode = useDarkMode()
  const debouncedKeyword = useDebounce(keyword, 200)
  const { data, isValidating } = useSearch(debouncedKeyword)

  return (
    <div
      className={cx(
        isDarkMode ? Classes.DARK : null,
        css`
          max-width: 500px;
          margin: 0 auto;
        `,
      )}>
      <div
        className={css`
          display: flex;
          margin: 5px;
        `}>
        <AssetSuggest
          inputProps={{
            large: true,
            placeholder: '股票、基金、外汇、数字货币',
            autoFocus: true,
          }}
          fill={true}
          className={css`
            margin: 5px;
          `}
          query={keyword}
          onQueryChange={setKeyword}
          items={data}
          noResults={
            keyword ? (
              <MenuItem
                disabled={true}
                text={isValidating ? 'Loading...' : 'No results.'}
              />
            ) : undefined
          }
          inputValueRenderer={(item) => item.name}
          itemRenderer={(item, { handleClick, modifiers }) => (
            <MenuItem
              key={item.type + item.id}
              icon={<TypeIcon type={item.type} />}
              text={item.name}
              label={item.label}
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
          placeholder="数量"
        />
        <Button
          large={true}
          icon="add"
          className={css`
            margin: 5px;
          `}
          disabled={!asset || !amount}
          intent={Intent.PRIMARY}
          onClick={async () => {
            if (asset && amount && mine) {
              setAmount('')
              setKeyword('')
              setAsset(null)
              await db.mine.add({
                amount: parseFloat(amount),
                ...asset,
              })
              await revalidate()
            }
          }}
        />
      </div>
      <Assets />
    </div>
  )
}
