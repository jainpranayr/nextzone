import { XIcon } from '@heroicons/react/solid'
import axios from 'axios'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { MyHead } from '../components'
import { Store } from '../config'
import Bag from '../public/images/bag.svg'

function Cart() {
	// setup router
	const router = useRouter()

	// get cartItems state and dispatch
	const {
		state: {
			cart: { cartItems },
		},
		dispatch,
	} = useContext(Store)

	const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
	const tax = Math.floor(subtotal * 0.18)
	const totalPrice = Math.floor(subtotal + tax)

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
	const handleCheckOut = e => {
		e.preventDefault()
		router.push('/shipping')
	}

	return (
		<div>
			<MyHead
				title={`Shopping Bag ${
					cartItems.length > 0 && '- ' + cartItems.length + ' item(s)'
				}`}
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>

			{cartItems.length <= 0 ? (
				<div className='flex flex-col items-center justify-center text-center h-[calc(100vh-160px)] w-full'>
					<img
						src={Bag.src}
						alt=''
						className='w-60 h-40 md:w-80 animate-wiggle object-cover object-center'
					/>
					<div className='ml-2 mt-3 space-y-1'>
						<h1 className='text-gray-800 text-lg'>Your bag looks empty</h1>
						<NextLink href='/search' passHref>
							<button className=' bg-indigo-600 border border-transparent rounded-md shadow-sm py-1.5 px-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500'>
								Go Shopping
							</button>
						</NextLink>
					</div>
				</div>
			) : (
				<div className='max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
					<h1 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
						Shopping Cart
					</h1>
					<form
						className='mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16'
						onSubmit={handleCheckOut}>
						<section className='lg:col-span-7'>
							<ul
								role='list'
								className='border-t border-b border-gray-200 divide-y divide-gray-200'>
								{cartItems.map((product, productIdx) => (
									<li key={product._id} className='flex py-6 sm:py-10'>
										<div className='flex-shrink-0'>
											<Image
												src={product.images[0]}
												alt={product.name}
												className='rounded-md object-center object-cover'
												width={150}
												height={220}
											/>
										</div>

										<div className='ml-4 flex-1 flex flex-col justify-between sm:ml-6'>
											<div className='relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0'>
												<div>
													<div className='flex justify-between'>
														<h3 className='text-sm'>
															<NextLink
																href={`/product/${product.slug}`}
																passHref>
																<p className='font-medium text-gray-700 hover:text-gray-800 cursor-pointer'>
																	{product.name}
																</p>
															</NextLink>
														</h3>
													</div>
													<div className='mt-1 flex text-sm'>
														<p className='text-gray-500 truncate'>
															{product.category}
														</p>
														<p className='ml-4 pl-4 border-l border-gray-200 text-gray-500'>
															{product.brand}
														</p>
													</div>
													<p className='mt-1 text-sm font-medium text-gray-900'>
														₹ {product.price}
													</p>
												</div>

												<div className='mt-4 sm:mt-0 sm:pr-9'>
													<select
														id={`quantity-${productIdx}`}
														name={`quantity-${productIdx}`}
														className='max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
														onChange={e =>
															updateProductQuantity(product, e.target.value)
														}
														value={product.quantity}>
														{[...Array(product.countInStock).keys()].map(x => (
															<option key={x + 1} value={x + 1}>
																{x + 1}
															</option>
														))}
													</select>

													<div className='absolute top-0 right-0'>
														<button
															type='button'
															className='-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500'
															onClick={() => handleRemoveItem(product)}>
															<span className='sr-only'>Remove</span>
															<XIcon className='h-5 w-5' aria-hidden='true' />
														</button>
													</div>
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</section>

						<section
							aria-labelledby='summary-heading'
							className='mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5'>
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
									type='submit'
									className='w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500'>
									Checkout
								</button>
							</div>
						</section>
					</form>
				</div>
			)}
		</div>
	)
}

export default Cart
