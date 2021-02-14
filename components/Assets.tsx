import { Classes, Intent, Menu, MenuItem } from '@blueprintjs/core'
import { Popover2 } from '@blueprintjs/popover2'
import { cx, css } from '@linaria/core'
import produce from 'immer'
import sum from 'lodash/sum'
import { useState } from 'react'
import useSWR from 'swr'
import { RiMoneyCnyCircleLine } from 'react-icons/ri'

import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { TypeIcon } from './TypeIcon'
import { Price } from './Price'

export function Assets() {
  const [total, setTotal] = useState<number[]>([])
  const { data: mine, revalidate } = useSWR('mine', () =>
    db.mine.orderBy('order').reverse().toArray(),
  )

  return (
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
                  await db.mine.delete(item.order!)
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
  )
}
