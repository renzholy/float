import { css } from '@linaria/core'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()

  return (
    <div
      className={css`
        padding: 16px;
      `}>
      <div className="nes-container">
        <p className="title">总计</p>
        <span className="nes-text is-primary">¥89999</span>
      </div>
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
