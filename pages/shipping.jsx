import { useRouter } from 'next/router'

export default function Shipping() {
  // setup router
  const router = useRouter()

  // redirect to login
  router.push('/login')
  return <div>Shipping</div>
}
