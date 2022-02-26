import { useRouter } from 'next/router'
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
} from '@material-ui/core'
import data from '../../utils/data'
import { Layout } from '../../components'
import useStyles from '../../utils/styles'

export default function ProductScreen() {
  // get styles
  const classes = useStyles()
  const router = useRouter()
  // get product slug from link
  const { slug } = router.query
  // find product in dummy data2
  const product = data.products.find(a => a.slug === slug)
  // if product not found
  if (!product) {
    return <div>Product Not Found</div>
  }
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
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
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
                <Button fullWidth variant='contained' color='primary'>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}
