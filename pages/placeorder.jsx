import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MyHead } from '../components'
import { getError, Store } from '../config'

const PlaceOrder = () => {
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

	const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
	const tax = Math.floor(subtotal * 0.18)
	const totalPrice = Math.floor(subtotal + tax)

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
					subtotal,
					tax,
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
			dispatch({ type: 'CLEAR_CART' })
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

	useEffect(() => {
		if (userInfo) {
			if (cartItems.length <= 0) {
				router.push('/search')
			}
		} else {
			router.push('/login')
		}
	}, [cartItems.length, router, userInfo])

	return (
		<>
			<MyHead
				title='Place Order'
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>
			<div className='max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
				<h1 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
					Place Order
				</h1>

				<div className='mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
					<div className='space-y-6 lg:col-start-1 lg:col-span-2'>
						<section aria-labelledby='applicant-information-title'>
							<div className='bg-white shadow sm:rounded-lg'>
								<div className='px-4 py-5 sm:px-6'>
									<h2
										id='applicant-information-title'
										className='text-lg leading-6 font-medium text-gray-900'>
										Shippig Address
									</h2>
								</div>
								<div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
									<dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
										<div className='sm:col-span-1'>
											<dt className='text-sm font-medium text-gray-500'>
												Delivery Details
											</dt>
											<dd className='mt-1 text-sm text-gray-900'>
												<span className='block'>{userInfo?.name}</span>
												<span className='block'>{shippingAddress.address}</span>
												<span className='block'>
													{shippingAddress.city} , {shippingAddress.state}
												</span>
												<span className='block'>
													{shippingAddress.postalCode}
												</span>
											</dd>
										</div>

										<div className='sm:col-span-1'>
											<dt className='text-sm font-medium text-gray-500'>
												Shipping Updates
											</dt>
											<dd className='mt-1 text-sm text-gray-900'>
												<span className='block'>{userInfo?.email}</span>
											</dd>
										</div>
									</dl>
								</div>
							</div>
						</section>

						<section aria-labelledby='applicant-information-title'>
							<div className='bg-white shadow sm:rounded-lg'>
								<div className='px-4 py-5 sm:px-6'>
									<h2
										id='applicant-information-title'
										className='text-lg leading-6 font-medium text-gray-900'>
										Order Items
									</h2>
								</div>
								<div className='border-t border-gray-200 px-4 sm:px-6 py-3'>
									{cartItems.map(product => (
										<div
											key={product?.id}
											className='last:border-b-0 border-b border-gray-200 flex space-x-4 py-5'>
											<div className='relative h-30 w-20 md:h-40 md:w-40 aspect-1 rounded-lg overflow-hidden flex-shrink-0'>
												<Image
													width={300}
													height={500}
													layout='responsive'
													src={product?.images[0]}
													alt={product.name}
													className='w-full h-full object-center object-cover hover:opacity-75'
												/>
											</div>
											<div className='flex-auto flex flex-col'>
												<div>
													<NextLink href={`/product/${product?.slug}`} passHref>
														<h4 className='font-medium text-gray-700 hover:text-gray-900 cursor-pointer'>
															{product?.name}
														</h4>
													</NextLink>
													<p className='mt-2 text-sm text-gray-600 line-clamp-2 max-w-lg'>
														{product?.description?.replace(/(<([^>]+)>)/gi, '')}
													</p>
												</div>
												<div className='mt-6 flex-1 flex items-end'>
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
															<dt className='font-medium text-gray-900'>
																Price
															</dt>
															<dd className='ml-2 text-gray-700'>
																{product?.price}
															</dd>
														</div>
													</dl>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					</div>
					<section
						aria-labelledby='summary-heading'
						className='mt-16 bg-white rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 h-max'>
						<h2
							id='summary-heading'
							className='text-lg font-medium text-gray-900'>
							Order summary
						</h2>

						<dl className='mt-6 space-y-4'>
							<div className='flex items-center justify-between'>
								<dt className='text-sm text-gray-600'>Subtotal</dt>
								<dd className='text-sm font-medium text-gray-900'>
									₹ {subtotal}
								</dd>
							</div>
							<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
								<dt className='flex text-sm text-gray-600'>
									<span>Tax(18%)</span>
									<a
										href='#'
										className='ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500'></a>
								</dt>
								<dd className='text-sm font-medium text-gray-900'>₹ {tax}</dd>
							</div>
							<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
								<dt className='text-base font-medium text-gray-900'>
									Order total
								</dt>
								<dd className='text-base font-medium text-gray-900'>
									₹ {totalPrice}
								</dd>
							</div>
						</dl>

						<div className='mt-6'>
							<button
								className='w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500'
								onClick={handlePlaceOrder}>
								{loading ? '...' : 'Place Order'}
							</button>
						</div>
					</section>
				</div>
			</div>
		</>
	)
}

export default PlaceOrder
