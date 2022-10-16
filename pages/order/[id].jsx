import {
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
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer } from 'react'
import toast from 'react-hot-toast'
import { MyHead } from '../../components'
import { getError, Store } from '../../config'
import { slugify, useStyles } from '../../utils'

function reducer(state, action) {
	switch (action.type) {
		// setup reducers for fetching order details
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' }
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, order: action.payload, error: '' }
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload }

		// setup reducers for paypal
		case 'PAY_REQUEST':
			return { ...state, loadingPay: true }
		case 'PAY_SUCCESS':
			return { ...state, loadingPay: false, successPay: true }
		case 'PAY_FAIL':
			return { ...state, loadingPay: false, errorPay: action.payload }
		case 'PAY_RESET':
			return { ...state, loadingPay: false, successPay: false, errorPay: '' }

		default:
			state
	}
}

function Order({ params }) {
	// get order id from url
	const orderId = params.id
	// get styles
	const classes = useStyles()
	// setuo router
	const router = useRouter()
	// get user details from context
	const {
		state: { userInfo },
	} = useContext(Store)

	// get required stares from paypal
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

	const [{ loading, error, order, successPay }, dispatch] = useReducer(
		reducer,
		{
			loading: true,
			order: {},
			error: '',
		}
	)

	const {
		shippingAddress,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		isPaid,
		paidAt,
		isDelivered,
		deliveredAt,
	} = order

	useEffect(() => {
		// if user not authenticated redirect to login page
		if (!userInfo) {
			return router.push('/login')
		}

		// fetch order details
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' })
				const { data } = await axios.get(`/api/orders/${orderId}`, {
					headers: { authorization: `Bearer ${userInfo.token}` },
				})
				dispatch({ type: 'FETCH_SUCCESS', payload: data })
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
			}
		}

		if (!order._id || successPay || (order._id && order._id !== orderId)) {
			fetchOrder()

			// if order succesfully paid
			if (successPay) {
				dispatch({ type: 'PAY_RESET' })
			}
		} else {
			// if payment not succesfull
			const loadPaypalScript = async () => {
				const clientId = process.env.PAYPAL_CLIENT_ID || 'sb'

				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': clientId,
						currency: 'INR',
					},
				})
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
			}

			loadPaypalScript()
		}
	}, [order, orderId, paypalDispatch, router, successPay, userInfo])

	// setup payment functions for paypal
	function createOrder(data, actions) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: totalPrice },
					},
				],
			})
			.then(orderID => {
				return orderID
			})
	}

	function onApprove(data, actions) {
		return actions.order.capture().then(async function (details) {
			try {
				dispatch({ type: 'PAY_REQUEST' })
				const { data } = await axios.put(
					`/api/orders/${order._id}/pay`,
					details,
					{
						headers: { authorization: `Bearer ${userInfo.token}` },
					}
				)
				dispatch({ type: 'PAY_SUCCESS', payload: data })
				toast.success('Order is paid', { duration: 3000 })
			} catch (err) {
				dispatch({ type: 'PAY_FAIL', payload: getError(err) })
				toast.error(getError(err), { duration: 3000 })
			}
		})
	}

	function onError(err) {
		toast.error(getError(err), { duration: 3000 })
	}

	return (
		<>
			<MyHead
				title={`Order - ${orderId.substring(20, 24)}`}
				url={window.location.href}
			/>

			<Typography component='h1' variant='h4'>
				Order {orderId}
			</Typography>
			{loading ? (
				<CircularProgress />
			) : error ? (
				<Typography className={classes.error}>{error}</Typography>
			) : (
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
								</ListItem>
								<ListItem>
									Status:{' '}
									{isDelivered
										? `delivered at ${deliveredAt}`
										: 'not delivered'}
								</ListItem>
							</List>
						</Card>
						<Card className={classes.section}>
							<List>
								<ListItem>
									Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
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
												{orderItems.map(item => (
													<TableRow key={item._id}>
														<TableCell>
															<NextLink
																href={`/product/${slugify(item.name)}`}
																passHref>
																<Link>
																	<Image
																		src={item?.images[0]}
																		alt={item.name}
																		width={50}
																		height={50}></Image>
																</Link>
															</NextLink>
														</TableCell>

														<TableCell>
															<NextLink
																href={`/product/${slugify(item.name)}`}
																passHref>
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
								{!isPaid && (
									<ListItem>
										{isPending ? (
											<CircularProgress />
										) : (
											<div style={{ width: '100%' }}>
												<PayPalButtons
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}></PayPalButtons>
											</div>
										)}
									</ListItem>
								)}
							</List>
						</Card>
					</Grid>
				</Grid>
			)}
		</>
	)
}

export async function getServerSideProps({ params }) {
	return { props: { params } }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })
