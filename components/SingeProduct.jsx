import axios from 'axios'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Store } from '../config'

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
			console.log('called')
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
					<div className='w-full bg-gray-200 rounded-lg overflow-hidden'>
						<Image
							width={300}
							height={500}
							layout='responsive'
							src={product?.images[0]}
							alt=''
							className='w-full h-full object-center object-cover group-hover:opacity-75'
						/>
					</div>
					<h3 className='mt-4 text-sm text-gray-700 line-clamp-1'>
						{product.name}
					</h3>
					<p className='mt-1 text-lg font-medium text-gray-900'>
						₹{product.price}
					</p>
				</div>
			</NextLink>

			<button
				disabled={!isInStock}
				className='mt-2 max-w-xs flex-1 flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full disabled:cursor-not-allowed bg-gray-200 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-300'
				onClick={() => handleAddToCart(product)}>
				Add to bag
			</button>
		</div>
	)
}
