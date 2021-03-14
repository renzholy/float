import { css, cx } from '@linaria/core'
import { sumBy } from 'lodash'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { ListItem } from '../components/ListItem'
import db from '../libs/db'
import { formatNumber } from '../libs/formatter'
import { ItemType } from '../libs/types'

export default function Index() {
  const router = useRouter()
  const { data: items, revalidate } = useSWR(
    'items',
    () => db.items.toArray(),
    {
      refreshInterval: 2000,
    },
  )
  const total = useMemo(
    () =>
      sumBy(items, (item) =>
        item.price === undefined ? NaN : item.amount * item.price,
      ),
    [items],
  )
  const [expanded, setExpanded] = useState<[ItemType, string]>()

  return (
    <div
      className={css`
        padding: 16px;
      `}>
      <div className="nes-container">
        <p className="title">总计</p>
        <span className="nes-text is-primary">¥{formatNumber(total)}</span>
      </div>
      {items?.length ? (
        <div
          className={cx(
            'nes-table-responsive',
            css`
              margin-top: 16px;
            `,
          )}>
          <table
            className={cx(
              'nes-table is-bordered',
              css`
                width: -webkit-fill-available;
                & td {
                  vertical-align: top;
                  line-height: 1.25;
                }
                & td:hover {
                  color: #209cee;
                }
                & td:active {
                  color: #006bb3;
                }
              `,
            )}>
            <tbody>
              {items?.map((item) => (
                <ListItem
                  key={item.type + item.id}
                  value={item}
                  isExpanded={
                    item.type === expanded?.[0] && item.id === expanded[1]
                  }
                  onClick={() => {
                    setExpanded(
                      item.type === expanded?.[0] && item.id === expanded[1]
                        ? undefined
                        : [item.type, item.id],
                    )
                    revalidate()
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <button
        type="button"
        className={cx(
          css`
            margin-top: 16px;
          `,
          'nes-btn is-success',
        )}
        onClick={() => {
          router.push('/search')
        }}>
        添加
      </button>
    </div>
  )
}
