import { StarIcon } from '@heroicons/react/solid'
import axios from 'axios'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Store } from '../config'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function SingleProduct({ product }) {
	const router = useRouter()
	const {
		state: {
			cart: { cartItems },
		},
		dispatch,
	} = useContext(Store)
	const [isInStock, setIsInStock] = useState(true)

	// handle Add to Cart
	const handleAddToCart = async product => {
		// check if item is in cart
		const existItem = cartItems.find(x => x._id === product._id)
		const quantity = existItem ? existItem.quantity + 1 : 1

		// add item to cart
		dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
		// redirect to /cart
		router.push('/cart')
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

		checkInStock()
	}, [cartItems, product])

	return (
		<div className='flex flex-col'>
			<NextLink href={`/product/${product.slug}`} passHref>
				<div className='group cursor-pointer'>
					<div className='relative w-full h-80 md:h-auto rounded-lg overflow-hidden'>
						<Image
							width={300}
							height={500}
							layout='responsive'
							src={product?.images[0]}
							alt=''
							className='w-full h-full object-center object-cover  hover:opacity-75'
						/>
					</div>
					<h3 className='mt-4 text-sm text-gray-700 line-clamp-1 hover:text-gray-900'>
						{product.name}
					</h3>
					{product.numReviews > 0 ? (
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
						</div>
					) : (
						<div className='flex items-center gap-x-1'>
							<StarIcon className='text-gray-300 h-5 w-5 flex-shrink-0' />
							No Reviews
						</div>
					)}
					<p className='mt-1 text-lg font-medium text-gray-900'>
						₹{product.price}
					</p>
				</div>
			</NextLink>

			<button
				disabled={!isInStock}
				className='relative flex bg-gray-200 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-300'
				onClick={() => handleAddToCart(product)}>
				Add to bag
			</button>
		</div>
	)
}
