import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Store } from '../config'

export default function Shipping() {
  // setup router
  const router = useRouter()
  // get userInfo and dispatch from Store
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store)

  // if user not logged in redirect to login with redirect set to shippping
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping')
    }
  }, [userInfo, router])

  return <div>Shipping</div>
}
