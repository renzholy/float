import { css, cx } from '@linaria/core'
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
import { RiMoneyCnyCircleLine } from 'react-icons/ri'
import produce from 'immer'
import sum from 'lodash/sum'
import { Popover2 } from '@blueprintjs/popover2'

import { Price } from '../components/Price'
import { Asset } from '../libs/types'
import { formatNumber } from '../libs/formatter'
import db from '../libs/db'
import { useDarkMode } from '../hooks/use-dark-mode'
import { useSearch } from '../hooks/use-search'
import useDebounce from '../hooks/use-debounce'
import { TypeIcon } from '../components/TypeIcon'

const AssetSuggest = Suggest.ofType<Asset>()

export default function Index() {
  const [keyword, setKeyword] = useState('')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState<Asset | null>(null)
  const { data: mine, revalidate } = useSWR('mine', () =>
    db.mine.orderBy('order').reverse().toArray(),
  )
  const [total, setTotal] = useState<number[]>([])
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
                order: mine.length,
              })
              await revalidate()
            }
          }}
        />
      </div>
      <Menu
        large={true}
        className={cx(
          css`
            margin: 5px 10px;
          `,
          Classes.ELEVATION_1,
        )}>
        {mine?.map((item, index) => (
          <Popover2
            key={item.type + item.id}
            placement="top"
            className={css`
              width: 100%;
            `}
            content={
              <Menu>
                <MenuItem
                  icon="trash"
                  intent={Intent.DANGER}
                  onClick={async () => {
                    await db.mine.delete(item.order)
                    await revalidate()
                    setTotal((old) =>
                      produce(old, (draft) => {
                        draft.splice(index, 1)
                      }),
                    )
                  }}
                  text="Remove"
                />
              </Menu>
            }>
            <MenuItem
              icon={<TypeIcon type={item.type} large={true} />}
              text={item.name}
              labelElement={
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
            />
          </Popover2>
        ))}
        <MenuItem
          icon={
            <RiMoneyCnyCircleLine
              size={20}
              className={css`
                fill: #5c7080;
                margin-top: 1px;
                margin-right: 7px;
              `}
            />
          }
          text="总计"
          label={formatNumber(sum(total))}
        />
      </Menu>
    </div>
  )
}
