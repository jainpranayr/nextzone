import { Layout, SingleProduct } from '../components'
import { Grid } from '@material-ui/core'
import { db } from '../config'
import { Product } from '../models'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Store } from '../config'

export default function Home({ products }) {
  const router = useRouter()
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  // handle Add to Cart
  const handleAddToCart = async product => {
    // check if item is in stock
    const existItem = cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    // get item detail
    const { data } = await axios.get(`/api/products/${product._id}`)

    // show error if item is not in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock')
      return
    }

    // add item to cart
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    // redirect to /cart
    router.push('/cart')
  }
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        {/* main products grid */}
        <Grid container spacing={3}>
          {products.map(product => (
            // single product grid
            <Grid item md={4} key={product.name}>
              <SingleProduct
                product={product}
                handleAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

// get products from database
export async function getServerSideProps() {
  // connect to database
  await db.connect()
  // get products and convert it to js object
  const products = await Product.find({}, '-reviews').lean()
  // disconect from database
  await db.disconnect()

  return {
    props: {
      // pass products and convert _id, createdAt, updateAt to string
      products: products.map(db.convertDocToObj),
    },
  }
}
