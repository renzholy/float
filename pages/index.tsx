import { css } from '@linaria/core'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { ListItem } from '../components/ListItem'
import db from '../libs/db'

export default function Index() {
  const router = useRouter()
  const { data: items } = useSWR('items', () => db.items.toArray())

  return (
    <div
      className={css`
        padding: 16px;
      `}>
      <div className="nes-container">
        <p className="title">总计</p>
        <span className="nes-text is-primary">¥89999</span>
      </div>
      {items?.map((item) => (
        <ListItem key={item.type + item.id} value={item} />
      ))}
      <button
        type="button"
        className="nes-btn is-primary"
        onClick={() => {
          router.push('/search')
        }}>
        添加
      </button>
    </div>
  )
}
