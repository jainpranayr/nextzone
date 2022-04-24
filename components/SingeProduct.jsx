import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import Rating from '@material-ui/lab/Rating'

export default function SingleProduct({ product, handleAddToCart }) {
  return (
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
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>

      {/* buttons and price */}
      <CardActions>
        <Typography>${product.price}</Typography>
        <Button
          variant='outlined'
          size='small'
          color='primary'
          onClick={() => handleAddToCart(product)}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  )
}
