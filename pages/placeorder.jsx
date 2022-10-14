import {
	Button,
	Card,
	CircularProgress,
	Grid,
	Link,
	List,
	ListItem,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core'
import axios from 'axios'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckoutWizard, Layout } from '../components'
import { getError, Store } from '../config'
import { useStyles } from '../utils'

const PlaceOrder = () => {
	// get styles
	const classes = useStyles()
	//   setup router
	const router = useRouter()
	// setup loading state
	const [loading, setLoading] = useState(false)
	//   get required states from context
	const {
		state: {
			userInfo,
			cart: { cartItems, shippingAddress },
		},
		dispatch,
	} = useContext(Store)

	//   123.456 => 123.46
	const round2 = num => Math.round(num * 100 + Number.EPSILON) / 100
	//   calculate cost of products
	const itemsPrice = round2(
		cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
	)
	//   calculate shipping cost
	const shippingPrice = itemsPrice > 200 ? 0 : 15
	//   calculate tax
	const taxPrice = round2(itemsPrice * 0.18)
	//   calculate total cost
	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

	// post order to db
	const handlePlaceOrder = async () => {
		try {
			setLoading(true)

			// post data
			const { data } = await axios.post(
				'/api/orders',
				{
					orderItems: cartItems,
					shippingAddress,
					itemsPrice,
					shippingPrice,
					taxPrice,
					totalPrice,
				},
				// auth headers
				{
					headers: {
						authorization: `Bearer ${userInfo.token}`,
					},
				}
			)

			// clear cart
			dispatch({ type: 'CART_CLEAR' })
			Cookies.remove('cartItems')

			setLoading(false)

			// redirect user to order page
			router.push(`/order/${data._id}`)
			toast.success('Order placed successfully')
		} catch (err) {
			setLoading(false)
			toast.error(getError(err), { duration: 3000 })
		}
	}

	return (
		<Layout title='Shopping Cart'>
			<CheckoutWizard activeStep={3}></CheckoutWizard>
			<Typography component='h1' variant='h4'>
				Place Order
			</Typography>

			<Grid container spacing={1}>
				<Grid item md={9} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h2' variant='h6'>
									Shipping Address
								</Typography>
							</ListItem>
							<ListItem>
								{shippingAddress.fullName}, {shippingAddress.address},{' '}
								{shippingAddress.city}, {shippingAddress.postalCode},{' '}
								{shippingAddress.state}
							</ListItem>
						</List>
					</Card>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography component='h2' variant='h6'>
									Order Items
								</Typography>
							</ListItem>
							<ListItem>
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Image</TableCell>
												<TableCell>Name</TableCell>
												<TableCell align='right'>Quantity</TableCell>
												<TableCell align='right'>Price</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{cartItems.map(item => (
												<TableRow key={item._id}>
													<TableCell>
														<NextLink href={`/product/${item.slug}`} passHref>
															<Link>
																<Image
																	src={item.images[0]}
																	alt={item.name}
																	width={50}
																	height={50}></Image>
															</Link>
														</NextLink>
													</TableCell>

													<TableCell>
														<NextLink href={`/product/${item.slug}`} passHref>
															<Link>
																<Typography>{item.name}</Typography>
															</Link>
														</NextLink>
													</TableCell>
													<TableCell align='right'>
														<Typography>{item.quantity}</Typography>
													</TableCell>
													<TableCell align='right'>
														<Typography>₹{item.price}</Typography>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</ListItem>
						</List>
					</Card>
				</Grid>
				<Grid item md={3} xs={12}>
					<Card className={classes.section}>
						<List>
							<ListItem>
								<Typography variant='h6'>Order Summary</Typography>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Items:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography align='right'>₹{itemsPrice}</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Tax:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography align='right'>₹{taxPrice}</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>Shipping:</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography align='right'>₹{shippingPrice}</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Grid container>
									<Grid item xs={6}>
										<Typography>
											<strong>Total:</strong>
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography align='right'>
											<strong>₹{totalPrice}</strong>
										</Typography>
									</Grid>
								</Grid>
							</ListItem>
							<ListItem>
								<Button
									variant='contained'
									color='primary'
									fullWidth
									onClick={handlePlaceOrder}>
									Place Order
								</Button>
							</ListItem>
							{loading && (
								<ListItem>
									<CircularProgress />
								</ListItem>
							)}
						</List>
					</Card>
				</Grid>
			</Grid>
		</Layout>
	)
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })
