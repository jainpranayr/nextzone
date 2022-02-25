import { Layout } from '../components'
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
import data from '../utils/data' // dummy data

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        {/* main products grid */}
        <Grid container spacing={3}>
          {data.products.map(product => (
            // single product grid
            <Grid item md={4} key={product.name}>
              {/* product card */}
              <Card>
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
