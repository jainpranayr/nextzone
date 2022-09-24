import Image from 'next/image'
import NextLink from 'next/link'

import { Tab } from '@headlessui/react'
import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { StarIcon } from '@heroicons/react/solid'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../../components'
import StarRatingPicker from '../../components/StarRatingPicker'
import { db, getError, Store } from '../../config'
import { Product } from '../../models'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function ProductScreen({ item }) {
	// setup router
	const router = useRouter()
	const { enqueueSnackbar } = useSnackbar()

	const [reviews, setReviews] = useState([])
	const [rating, setRating] = useState(0)
	const [comment, setComment] = useState('')
	const [product, setProduct] = useState(item)
	const [isInStock, setIsInStock] = useState(true)

	// get state and dispatch function from store
	const {
		state: {
			cart: { cartItems },
			userInfo,
		},
		dispatch,
	} = useContext(Store)

	// handle Add to Cart
	const handleAddToCart = async e => {
		e.preventDefault()
		// check if item is in stock
		const existItem = cartItems.find(x => x._id === product._id)
		const quantity = existItem ? existItem.quantity + 1 : 1

		// dispatch add to cart function
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
		// redirect to /cart
		router.push('/cart')
	}

	const fetchReviews = async () => {
		try {
			const { data } = await axios.get(`/api/products/${product._id}/reviews`)
			setReviews(data)
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	const fetchProduct = async () => {
		try {
			const { data } = await axios.get(`/api/products/${product._id}`)
			setProduct(data)
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	const submitHandler = async e => {
		e.preventDefault()
		try {
			await axios.post(
				`/api/products/${product._id}/reviews`,
				{
					rating,
					comment,
				},
				{
					headers: { authorization: `Bearer ${userInfo.token}` },
				}
			)
			enqueueSnackbar('Review submitted successfully', { variant: 'success' })
			setComment('')
			fetchReviews()
			fetchProduct()
		} catch (err) {
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	useEffect(() => {
		async function checkInStock() {
			const existItem = cartItems.find(x => x._id === product._id)
			const quantity = existItem ? existItem.quantity + 1 : 1

			// get item detail
			const { data } = await axios.get(`/api/products/${product._id}`)

			if (data.countInStock < quantity) {
				setIsInStock(false)
				return
			}
		}

		fetchReviews()
		checkInStock()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// if product not found
	if (!product) {
		return <div>Product Not Found</div>
	}

	// if product found
	return (
		<Layout title={product.name} description={product.description}>
			<section className='bg-white mt-10'>
				<div className='max-w-2xl mx-auto p-4 sm:px-6 lg:max-w-7xl lg:px-8'>
					<div className='lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start'>
						{/* Image gallery */}
						<Tab.Group as='div' className='flex flex-col-reverse'>
							<div className='hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none'>
								<Tab.List className='grid grid-cols-4 gap-4'>
									{product.images.map((image, idx) => (
										<Tab
											key={idx}
											className='relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50'>
											{({ selected }) => (
												<>
													<span className='absolute inset-0 rounded-md overflow-hidden'>
														<Image
															src={image}
															alt=''
															className='w-full h-full object-center object-cover'
															layout='fill'
															priority='eager'
														/>
													</span>
													<span
														className={classNames(
															selected ? 'ring-indigo-500' : 'ring-transparent',
															'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
														)}
														aria-hidden='true'
													/>
												</>
											)}
										</Tab>
									))}
								</Tab.List>
							</div>
							<Tab.Panels className='w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden'>
								{product.images.map((image, idx) => (
									<Tab.Panel key={idx}>
										<Image
											src={image}
											alt={image.alt}
											className='object-center object-cover sm:rounded-lg'
											width={600}
											height={800}
											priority='eager'
										/>
									</Tab.Panel>
								))}
							</Tab.Panels>
						</Tab.Group>
						{/* Product Details */}
						<div className='mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0'>
							<h1 className='text-3xl font-extrabold tracking-tight text-gray-900'>
								{product.name}
							</h1>

							<div className='mt-3'>
								<p className='text-3xl text-gray-900'>₹{product.price}</p>
							</div>

							{/* Reviews */}
							<div className='mt-3'>
								<h3 className='sr-only'>Reviews</h3>
								<div className='flex items-center'>
									<div className='flex items-center'>
										{[0, 1, 2, 3, 4].map(rating => (
											<StarIcon
												key={rating}
												className={classNames(
													product.rating > rating
														? 'text-indigo-500'
														: 'text-gray-300',
													'h-5 w-5 flex-shrink-0'
												)}
											/>
										))}
										<a
											href='#reviews'
											className='ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500'>
											{reviews.length} reviews
										</a>
									</div>
								</div>
							</div>
							<div className='mt-6'>
								<h3 className='sr-only'>Description</h3>
								<div
									className='text-base text-gray-700 space-y-6'
									dangerouslySetInnerHTML={{ __html: product.description }}
								/>
							</div>

							<div className='text-sm font-medium cursor-pointer flex flex-col gap-y-2 mt-6'>
								<div className='space-x-2'>
									<span className='text-gray-400'>Brand</span>
									<NextLink href={`/search?brand=${product.brand}`} passHref>
										<span className='text-indigo-600 hover:text-indigo-900 '>
											{product.brand}
										</span>
									</NextLink>
								</div>

								<div className='space-x-2'>
									<span className='text-gray-400'>Category</span>
									<NextLink
										href={`/search?category=${product.category}`}
										passHref>
										<span className='text-indigo-600 hover:text-indigo-900 '>
											{product.category}
										</span>
									</NextLink>
								</div>
							</div>

							<div className='mt-6 flex items-center'>
								{isInStock ? (
									<>
										<CheckIcon
											className='flex-shrink-0 w-5 h-5 text-green-500'
											aria-hidden='true'
										/>
										<p className='ml-2 text-sm text-gray-500'>
											In stock and ready to ship
										</p>
									</>
								) : (
									<>
										<XIcon
											className='flex-shrink-0 w-5 h-5 text-red-500'
											aria-hidden='true'
										/>
										<p className='ml-2 text-sm text-gray-500'>
											Sorry, this item is sold out.
										</p>
									</>
								)}
							</div>

							<form className='mt-6 flex sm:flex-col1'>
								<button
									disabled={!isInStock}
									className='max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full disabled:cursor-not-allowed'
									onClick={handleAddToCart}>
									Add to bag
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className='max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8 mt-10'>
					<div className='lg:col-span-4'>
						<h2 className='text-2xl font-extrabold tracking-tight text-gray-900'>
							Customer Reviews
						</h2>

						<div className='mt-3 flex items-center'>
							<div className='flex items-center'>
								{[0, 1, 2, 3, 4].map(rating => (
									<StarIcon
										key={rating}
										className={classNames(
											product.rating > rating
												? 'text-indigo-500'
												: 'text-gray-300',
											'flex-shrink-0 h-5 w-5'
										)}
										aria-hidden='true'
									/>
								))}
							</div>
							<p className='ml-2 text-sm text-gray-900'>
								Based on {reviews.length} reviews
							</p>
						</div>

						{userInfo ? (
							<div className='mt-5'>
								<h3 className='text-lg font-medium text-gray-900'>
									Share your thoughts
								</h3>
								<p className='mt-1 text-sm text-gray-600'>
									If you&apos;ve used this product, share your thoughts with
									other customers
								</p>
							</div>
						) : (
							<div className='mt-5 text-sm text-gray-600'>
								To write a review, you must first{' '}
								<NextLink
									href={`/login?redirect=/product/${product.slug}`}
									passHref>
									<span className='text-indigo-500 font-semibold cursor-pointer'>
										Sign in.
									</span>
								</NextLink>
							</div>
						)}
						{userInfo ? (
							<form className='relative mt-6' onSubmit={submitHandler}>
								<div className='border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'>
									<textarea
										id='review-form'
										rows={2}
										className='block w-full border-0 py-0 resize-none placeholder-gray-500 focus:ring-0 sm:text-sm'
										placeholder='Write a review...'
										value={comment}
										onChange={e => setComment(e.target.value)}
									/>

									{/* Spacer element to match the height of the toolbar */}
									<div aria-hidden='true'>
										<div className='py-2'>
											<div className='h-9' />
										</div>
										<div className='h-px' />
										<div className='py-2'>
											<div className='py-px'>
												<div className='h-9' />
											</div>
										</div>
									</div>
								</div>

								<div className='absolute bottom-0 inset-x-px'>
									<div className='border-t border-gray-200 px-2 py-2 flex justify-between items-center space-x-3 sm:px-3'>
										<StarRatingPicker
											value={rating}
											onChange={newVal => setRating(newVal)}
										/>
										<div className='flex-shrink-0'>
											<button
												disabled={comment.length <= 0}
												type='submit'
												className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed'>
												Submit
											</button>
										</div>
									</div>
								</div>
							</form>
						) : null}
					</div>

					<div className='mt-16 lg:mt-0 lg:col-start-6 lg:col-span-7'>
						{reviews.length >= 0 ? (
							<div className='flow-root' id='reviews'>
								<div className='-my-8 divide-y divide-gray-200'>
									{reviews.map(review => (
										<div key={review._id} className='py-8'>
											<div className='flex flex-col space-y-2'>
												<div className='flex items-center'>
													{[0, 1, 2, 3, 4].map(rating => (
														<StarIcon
															key={rating}
															className={classNames(
																review.rating > rating
																	? 'text-indigo-500'
																	: 'text-gray-300',
																'h-5 w-5 flex-shrink-0'
															)}
														/>
													))}
												</div>
												<div className='flex items-center space-x-3 ml-1'>
													<h4 className='text-sm font-bold text-gray-900'>
														{review.name}
													</h4>
													<span className=' text-gray-200 dark:text-gray-800'>
														/
													</span>
													<p className='text-sm text-gray-400 dark:text-gray-600'>
														{new Date(review.updatedAt).toDateString()}
													</p>
												</div>
												<div
													className='mt-4 space-y-6 text-base italic text-gray-600'
													dangerouslySetInnerHTML={{ __html: review.comment }}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className='mt-5 text-sm text-gray-600'>
								There are no reviews. Be the first to write a{' '}
								<a
									href='#review-form'
									className='text-indigo-500 font-semibold cursor-pointer'>
									review
								</a>{' '}
								for this item.
							</div>
						)}
					</div>
				</div>
			</section>
		</Layout>
	)
}

// get product details from database
export async function getServerSideProps(context) {
	// get slug of product
	const { params } = context
	const { slug } = params

	// connect to database
	await db.connect()
	// find product by slug in database
	const product = await Product.findOne({ slug }, '-reviews').lean()
	// disconnect from database
	await db.disconnect()

	// pass product as prop
	return {
		props: {
			item: db.convertDocToObj(product),
		},
	}
}
