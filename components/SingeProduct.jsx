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
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Store } from '../config'

export default function SingleProduct({ product }) {
	const router = useRouter()
	const {
		state: {
			cart: { cartItems },
		},
		dispatch,
	} = useContext(Store)

	// handle Add to Cart
	const handleAddToCart = async product => {
		// check if item is in cart
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
		<Card>
			{/* route to product page */}
			<NextLink href={`/product/${product.slug}`} passHref>
				{/* Clickable content on card */}
				<CardActionArea>
					<CardMedia
						component='img'
						image={product.images[0]}
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
