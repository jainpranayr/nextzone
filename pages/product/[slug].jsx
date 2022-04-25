import NextLink from 'next/link'
import Image from 'next/image'
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'

import { Layout } from '../../components'
import { useStyles } from '../../utils'
import { Product } from '../../models'
import { db } from '../../config'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Store, getError } from '../../config'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'

export default function ProductScreen({ product }) {
  // get styles
  const classes = useStyles()
  // setup router
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  // get state and dispatch function from store
  const {
    state: {
      cart: { cartItems },
      userInfo,
    },
    dispatch,
  } = useContext(Store)

  // if product not found
  if (!product) {
    return <div>Product Not Found</div>
  }

  // handle Add to Cart
  const handleAddToCart = async () => {
    // check if item is in stock
    const existItem = cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    // get product details
    const { data } = await axios.get(`/api/products/${product._id}`)

    // show error if item is not in stock
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock')
      return
    }

    // dispatch add to cart function
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
    // redirect to /cart
    router.push('/cart')
  }

  const submitHandler = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      )
      setLoading(false)
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      fetchReviews()
    } catch (err) {
      setLoading(false)
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`)
      setReviews(data)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }
  useEffect(() => {
    fetchReviews()
  }, [])

  // if product found
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        {/* back to home link */}
        <NextLink href='/' passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>

      {/* main grid */}
      <Grid container spacing={1}>
        {/* product image */}
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout='responsive'></Image>
        </Grid>

        {/* product details */}
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography className={classes.heading}>
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Link href='#reviews'>
                <Typography>({product.numReviews} reviews)</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>

        {/* Price and add to cart section */}
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              {/* Product price */}
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>

              {/* Product stock stautus */}
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Add to Cart button */}
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  onClick={handleAddToCart}>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography name='reviews' id='reviews' variant='h4'>
            Customer Reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem>No review</ListItem>}
        {reviews.map(review => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant='h6'>Leave your review</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant='outlined'
                    fullWidth
                    name='review'
                    label='Enter comment'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name='simple-controlled'
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    color='primary'>
                    Submit
                  </Button>

                  {loading && <CircularProgress></CircularProgress>}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography variant='h6'>
              Please{' '}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                login
              </Link>{' '}
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  )
}

// get product details from database
export async function getServerSideProps(context) {
  // get slug of product
  const { params } = context
  const { slug } = params

  // connect to database
  await db.connect()
  // find product by slug in database
  const product = await Product.findOne({ slug }, '-reviews').lean()
  // disconnect from database
  await db.disconnect()

  // pass product as prop
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  }
}
