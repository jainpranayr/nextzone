import { XIcon } from '@heroicons/react/solid'
import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { MyHead } from '../components'
import { Store } from '../config'

export default function Shipping() {
	// setup router
	const router = useRouter()

	// get userInfo and dispatch from Store
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

	// get required values from react hook form
	const {
		handleSubmit,
		formState: { errors },
		setValue,
		register,
	} = useForm()

	useEffect(() => {
		// if user not logged in redirect to login with redirect set to shippping
		if (!userInfo) {
			router.push('/login?redirect=/shipping')
		}

		if (shippingAddress || userInfo) {
			// set values from saved address
			setValue('fullName', shippingAddress.fullName || userInfo?.name)
			setValue('address', shippingAddress.address)
			setValue('city', shippingAddress.city)
			setValue('postalCode', shippingAddress.postalCode)
			setValue('state', shippingAddress.state)
		}
	}, [userInfo, router, setValue, shippingAddress])

	// form submit handler
	const submitHandler = ({ fullName, address, city, postalCode, state }) => {
		// dispatch save shipping address function
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: { fullName, address, city, postalCode, state },
		})

		// store address in cookies
		Cookies.set('shippingAddress', {
			fullName,
			address,
			city,
			postalCode,
			state,
		})

		// redirect user to placeorder page
		router.push('/placeorder')
	}

	const handleRemoveItem = item => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
	}

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

	function fillGuestAddress() {
		setValue('fullName', 'Vernon Dursley')
		setValue('address', '4 Privet Drive')
		setValue('city', 'Little Whinging')
		setValue('state', 'Surrey')
		setValue('postalCode', '7777777')
	}

	return (
		<div className='max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
			<MyHead
				title='Shipping Address'
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>
			<h1 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
				Checkout
			</h1>
			<div className='mt-2 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16'>
				<form
					className='space-y-8 mt-6 px-4 sm:px-6 lg:col-span-7 order-last lg:order-none'
					onSubmit={handleSubmit(submitHandler)}>
					<div>
						<h2 className='leading-6 font-medium text-2xl text-gray-900'>
							Shipping Address
						</h2>
					</div>
					<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
						<div className='sm:col-span-4'>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'>
								Full name
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='fullName'
									id='name'
									autoComplete='given-name'
									className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
									{...register('fullName', {
										required: true,
										minLength: 3,
									})}
								/>
							</div>
							{errors.fullName && (
								<p className='mt-2 text-sm text-red-600' id='email-error'>
									Your username must be atleast 3 characters long.
								</p>
							)}
						</div>

						<div className='sm:col-span-6'>
							<label
								htmlFor='street-address'
								className='block text-sm font-medium text-gray-700'>
								Street address
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='street-address'
									id='street-address'
									autoComplete='street-address'
									className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
									{...register('address', {
										required: true,
									})}
								/>
							</div>
							{errors.address && (
								<p className='mt-2 text-sm text-red-600' id='email-error'>
									Street Address is required
								</p>
							)}
						</div>

						<div className='sm:col-span-2'>
							<label
								htmlFor='city'
								className='block text-sm font-medium text-gray-700'>
								City
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='city'
									id='city'
									autoComplete='address-level2'
									className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
									{...register('city', {
										required: true,
									})}
								/>
							</div>
							{errors.city && (
								<p className='mt-2 text-sm text-red-600' id='email-error'>
									City is required
								</p>
							)}
						</div>

						<div className='sm:col-span-2'>
							<label
								htmlFor='region'
								className='block text-sm font-medium text-gray-700'>
								State / Province
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='region'
									id='region'
									autoComplete='address-level1'
									className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
									{...register('state', {
										required: true,
									})}
								/>
							</div>
							{errors.state && (
								<p className='mt-2 text-sm text-red-600' id='email-error'>
									State is required
								</p>
							)}
						</div>

						<div className='sm:col-span-2'>
							<label
								htmlFor='postal-code'
								className='block text-sm font-medium text-gray-700'>
								ZIP / Postal code
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='postal-code'
									id='postal-code'
									autoComplete='postal-code'
									className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
									{...register('postalCode', {
										required: true,
										pattern: /^([0-9]{6,7})$/,
									})}
								/>
							</div>
							{errors.postalCode && (
								<p className='mt-2 text-sm text-red-600' id='email-error'>
									Your postalCode is not valid.
								</p>
							)}
						</div>
					</div>

					<div className='mt-5 flex justify-end gap-y-2'>
						<button
							onClick={fillGuestAddress}
							className='flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'>
							Use guest address
						</button>
						<button
							type='submit'
							className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Proceed
						</button>
					</div>
				</form>

				<section
					aria-labelledby='summary-heading'
					className='mt-5 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5'>
					<h2
						id='summary-heading'
						className='text-lg font-medium text-gray-900'>
						Order summary
					</h2>

					<div className='mt-4 bg-gray-50  border-gray-200 rounded-lg shadow-sm'>
						<ul role='list' className='divide-y divide-gray-200'>
							{cartItems.map((product, productIdx) => (
								<li key={product._id} className='flex py-6'>
									<div className='relative h-28 w-24 md:h-40 md:w-36 aspect-1 rounded-lg overflow-hidden'>
										<Image
											width={300}
											height={520}
											layout='responsive'
											src={product?.image}
											alt={product.name}
											className='w-full h-full object-center object-cover hover:opacity-75 border'
										/>
									</div>

									<div className='ml-4 flex-1 flex flex-col justify-between sm:ml-6 relative pr-9 sm:gap-x-6 sm:pr-0'>
										<div className='flex flex-col justify-between h-full gap-y-2'>
											<div>
												<NextLink href={`/product/${product?.slug}`} passHref>
													<h4 className='font-medium text-gray-700 hover:text-gray-900 cursor-pointer'>
														{product?.name}
													</h4>
												</NextLink>
												<p className='text-sm text-gray-600 line-clamp-2 max-w-sm'>
													{product?.description}
												</p>
											</div>

											<select
												id={`quantity-${productIdx}`}
												name={`quantity-${productIdx}`}
												className='w-fit rounded-md border border-gray-300 py-1 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
										</div>

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
								</li>
							))}
						</ul>
					</div>

					<dl className='border-t border-gray-200 px-4 space-y-6 sm:px-6 mt-6'>
						<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
							<dt className='text-sm text-gray-600'>Subtotal</dt>
							<dd className='text-sm font-medium text-gray-900'>
								₹ {subtotal}
							</dd>
						</div>
						<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
							<dt className='flex text-sm text-gray-600'>
								<span>Tax(18%)</span>
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
				</section>
			</div>
		</div>
	)
}
