import axios from 'axios'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer } from 'react'
import { MyHead } from '../../components'
import { getError, Store } from '../../config'

function reducer(state, action) {
	switch (action.type) {
		// setup reducers for fetching order details
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' }
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, order: action.payload, error: '' }
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload }

		default:
			state
	}
}

function Order() {
	// setuo router
	const router = useRouter()
	const orderId = router.query.id
	// get user details from context
	const {
		state: { userInfo },
	} = useContext(Store)

	const [{ loading, order }, dispatch] = useReducer(reducer, {
		loading: true,
		order: {},
		error: '',
	})

	const {
		subtotal,
		tax,
		totalPrice,
		username,
		user_email,
		shippingAddress,
		orderItems,
		orderId: order_id,
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

		if (!order._id || (order._id && order._id !== orderId)) {
			fetchOrder()
		}
	}, [order._id, orderId, router, userInfo])

	if (loading || !order) return <p>loading...</p>

	return (
		<>
			<MyHead
				title={`Order - ${order_id}`}
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>

			<div className='mt-10'>
				<div className='max-w-2xl mx-auto px-4 py-16 sm:px-6  lg:px-8 bg-white'>
					<div className='max-w-xl'>
						<h1 className='text-sm font-semibold uppercase tracking-wide text-indigo-600'>
							Thank you!
						</h1>
						<p className='mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl'>
							It&apos;s on the way!
						</p>
						<p className='mt-2 text-base text-gray-500'>
							Your order{' '}
							<span className='rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2'>
								#{order_id}
							</span>{' '}
							has shipped and will be with you soon.
						</p>
					</div>

					<div className='mt-10 border-t border-gray-200'>
						{!loading &&
							orderItems.map(product => (
								<div
									key={product?.id}
									className='py-10 border-b border-gray-200 flex space-x-4'>
									<div className='relative h-full w-full lg:h-40 lg:w-40 aspect-1 rounded-lg overflow-hidden flex-shrink'>
										<Image
											width={300}
											height={500}
											layout='responsive'
											src={product?.image}
											alt={product.name}
											className='w-full h-full object-center object-cover hover:opacity-75'
										/>
									</div>
									<div className='flex-auto flex flex-col justify-between'>
										<div>
											<NextLink href={`/product/${product?.slug}`} passHref>
												<h4 className='font-medium text-gray-700 hover:text-gray-900 cursor-pointer'>
													{product?.name}
												</h4>
											</NextLink>
											<p className='text-sm text-gray-600 hidden md:inline-block max-w-lg'>
												{product?.description}
											</p>
										</div>

										<div>
											<dl className='flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6'>
												<div className='flex'>
													<dt className='font-medium text-gray-900'>
														Quantity
													</dt>
													<dd className='ml-2 text-gray-700'>
														{product?.quantity}
													</dd>
												</div>
												<div className='pl-4 flex sm:pl-6'>
													<dt className='font-medium text-gray-900'>Price</dt>
													<dd className='ml-2 text-gray-700'>
														₹{product?.price}
													</dd>
												</div>
											</dl>
										</div>
									</div>
								</div>
							))}

						<div className='sm:ml-40 sm:pl-6'>
							<dl className='grid grid-cols-2 gap-x-6 text-sm py-10'>
								<div>
									<dt className='font-medium text-gray-900'>
										Shipping address
									</dt>
									<dd className='mt-2 text-gray-700'>
										<address className='not-italic'>
											<span className='block'>{username}</span>
											<span className='block'>{shippingAddress?.address}</span>
											<span className='block'>
												{shippingAddress?.city} , {shippingAddress?.state}
											</span>
											<span className='block'>
												{shippingAddress?.postalCode}
											</span>
										</address>
									</dd>
								</div>

								<div>
									<dt className='font-medium text-gray-900'>
										Shipping Updates
									</dt>
									<dd className='mt-1 text-sm text-gray-900'>
										<span className='block'>{user_email}</span>
									</dd>
								</div>
							</dl>

							<dl className='space-y-6 border-t border-gray-200 text-sm pt-10'>
								<div className='flex justify-between'>
									<dt className='font-medium text-gray-900'>Subtotal</dt>
									<dd className='text-gray-700'>₹ {subtotal}</dd>
								</div>
								<div className='flex justify-between'>
									<dt className='font-medium text-gray-900'>Tax(18%)</dt>
									<dd className='text-gray-700'>₹ {tax}</dd>
								</div>
								<div className='flex justify-between'>
									<dt className='font-medium text-gray-900'>Total</dt>
									<dd className='text-gray-900'>₹ {totalPrice}</dd>
								</div>
							</dl>

							<div className='mt-10 border-t border-gray-200 py-6 text-right'>
								<NextLink href='/' passHref>
									<p className='text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer'>
										Continue Shopping&rarr;
									</p>
								</NextLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Order
