import React from 'react'
import { useRouter } from 'next/router'
import data from '../../utils/data'

export default function ProductScreen() {
  const router = useRouter()
  // get product slug from link
  const { slug } = router.query
  // find product in dummy data
  const product = data.products.find(a => a.slug === slug)
  // if product not found
  if (!product) {
    return <div>Product Not Found</div>
  }
  // if product found
  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  )
}
