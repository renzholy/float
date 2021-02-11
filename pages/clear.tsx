import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import db from '../libs/db'

export default function Clear() {
  const router = useRouter()
  useEffect(() => {
    db.delete().then(() => {
      router.push('/')
    })
  }, [router])

  return null
}
