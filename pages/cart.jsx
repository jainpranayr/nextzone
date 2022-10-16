import {
	Button,
	Card,
	Grid,
	Link,
	List,
	ListItem,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { MyHead } from '../components'
import { Store } from '../config'
import { useStyles } from '../utils'

function Cart() {
	// setup router
	const router = useRouter()
	// get styles
	const classes = useStyles()
	// get cartItems state and dispatch
	const {
		state: {
			cart: { cartItems },
		},
		dispatch,
	} = useContext(Store)

	// update quantity count in cart
	const updateProductQuantity = async (item, quantity) => {
		// get product detail
		const { data } = await axios.get(`/api/products/${item._id}`)

		// show error if item is out of stock
		if (data.countInStock < quantity) {
			window.alert('Sorry. Product is out of stock')
			return
		}

		// update cartItems quantity
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
	}

	// remove item from cart
	const handleRemoveItem = item => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
	}

	// redirect to shipping after clicking checkout
	const handleCheckOut = () => {
		router.push('/shipping')
	}

	return (
		<>
			<MyHead
				title={`Shopping Bag ${
					cartItems.length > 0 && '- ' + cartItems.length + ' item(s)'
				}`}
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>
			{/* check whether cartItem is empty or not */}
			{cartItems.length === 0 ? (
				<div className={classes.section}>
					Cart is empty.{' '}
					<NextLink href='/' passHref>
						<Link>Go shopping</Link>
					</NextLink>
				</div>
			) : (
				// main grid
				<Grid container spacing={2} className={classes.section}>
					{/* table grid */}
					<Grid item md={9} xs={12}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										{/* table column headings */}
										<TableCell>Image</TableCell>
										<TableCell>Name</TableCell>
										<TableCell align='right'>Quantity</TableCell>
										<TableCell align='right'>Price</TableCell>
										<TableCell align='right'>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{/* individual cartItems */}
									{cartItems.map(item => (
										<TableRow key={item._id}>
											{/* product image */}
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Image
															className='object-contain'
															src={item.images[0]}
															alt={item.name}
															width={50}
															height={50}
															priority='lazy'></Image>
													</Link>
												</NextLink>
											</TableCell>

											{/* product name */}
											<TableCell>
												<NextLink href={`/product/${item.slug}`} passHref>
													<Link>
														<Typography>{item.name}</Typography>
													</Link>
												</NextLink>
											</TableCell>

											{/* product quantity */}
											<TableCell align='right'>
												<Select
													value={item.quantity}
													onChange={e =>
														updateProductQuantity(item, e.target.value)
													}>
													{[...Array(item.countInStock).keys()].map(x => (
														<MenuItem key={x + 1} value={x + 1}>
															{x + 1}
														</MenuItem>
													))}
												</Select>
											</TableCell>

											{/* product price */}
											<TableCell align='right'>₹{item.price}</TableCell>

											{/* remove from cart button */}
											<TableCell align='right'>
												<Button
													variant='contained'
													color='primary'
													onClick={() => handleRemoveItem(item)}>
													x
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>

					{/* total grid */}
					<Grid item md={3} xs={12} className={classes.card}>
						<Card>
							<List>
								<ListItem>
									{/* subtotal heading */}
									<Typography variant='h6'>
										Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
										items) : ₹
										{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
									</Typography>
								</ListItem>

								{/* check out button */}
								<ListItem>
									<Button
										variant='contained'
										color='primary'
										fullWidth
										onClick={handleCheckOut}>
										Check Out
									</Button>
								</ListItem>
							</List>
						</Card>
					</Grid>
				</Grid>
			)}
		</>
	)
}

// do not render in ssr
export default dynamic(() => Promise.resolve(Cart), { ssr: false })
