import { Layout } from '../components'
import NextLink from 'next/link'
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core'
import { db } from '../config'
import { Product } from '../models'

export default function Home({ products }) {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        {/* main products grid */}
        <Grid container spacing={3}>
          {products.map(product => (
            // single product grid
            <Grid item md={4} key={product.name}>
              {/* product card */}
              <Card>
                {/* route to product page */}
                <NextLink href={`/product/${product.slug}`} passHref>
                  {/* Clickable content on card */}
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      image={product.image}
                      title={product.name}></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>

                {/* buttons and price */}
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button variant='outlined' size='small' color='primary'>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
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
  const products = await Product.find({}).lean()
  // disconect from database
  await db.disconnect()

  return {
    props: {
      // pass products and convert _id, createdAt, updateAt to string
      products: products.map(db.convertDocToObj),
    },
  }
}
