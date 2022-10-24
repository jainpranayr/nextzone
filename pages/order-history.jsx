import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { MyHead } from '../components'
import { db } from '../config'
import { Order } from '../models'
import Order  from '../public/images/order.svg'
import { classNames } from '../utils'
import { Store } from '/config'

function OrderHistory({ orders }) {
	const { state } = useContext(Store)
	const router = useRouter()
	const { userInfo } = state

	useEffect(() => {
		if (!userInfo) {
			router.push('/login')
		}
	}, [router, userInfo])

	return (
		<>
			<MyHead
				title='Order History'
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>

			<div className='mt-2 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16'>
				<nav className='mt-6 lg:col-span-3 shadow overflow-hidden rounded-md'>
					<NextLink href='/profile' passHref>
						<p
							className={classNames(
								router.pathname === '/profile'
									? 'bg-slate-100 text-gray-900'
									: 'bg-white text-gray-700 hover:text-gray-900',
								'border px-4 py-4 sm:px-6 text-center font-medium cursor-pointer'
							)}>
							User Profile
						</p>
					</NextLink>
					<NextLink href='/profile' passHref>
						<p
							className={classNames(
								router.pathname === '/order-history'
									? 'bg-slate-100 text-gray-900'
									: 'bg-white text-gray-700 hover:text-gray-900',
								'border px-4 py-4 sm:px-6 text-center font-medium cursor-pointer'
							)}>
							Order History
						</p>
					</NextLink>
				</nav>

				{orders && orders.length <= 0 ? (
					<div className='flex flex-col items-center justify-center text-center h-[calc(100vh-258px)] w-full lg:col-span-9'>
						<img
							src={Order.src}
							alt=''
							className='w-60 h-40 md:w-81 animate-wiggle object-cover object-center'
						/>

						<div className='ml-3 mt-3 space-y-1'>
							<h1 className='text-gray-800 text-lg font-medium'>
								No orders found.
							</h1>

							<NextLink href='/search' passHref>
								<p className='text-indigo-500 font-semibold leading-relaxed text-sm cursor-pointer hover:underline'>
									Order now
								</p>
							</NextLink>
						</div>
					</div>
				) : (
					<main className='space-y-8 mt-6 px-4 sm:px-6 lg:col-span-9 bg-white'>
						<h1 className='mt-6 text-xl font-medium text-gray-900 sm:text-3xl'>
							Order history
						</h1>

						<div className='space-y-20'>
							{orders.map(order => (
								<div key={order._id}>
									<div className='bg-gray-100 rounded-lg py-6 px-4 sm:px-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 lg:space-x-8'>
										<dl className='divide-y divide-gray-200 space-y-6 text-sm text-gray-600 flex-auto sm:divide-y-0 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 lg:w-1/2 lg:flex-none lg:gap-x-8'>
											<div className='flex justify-between sm:block'>
												<dt className='font-medium text-gray-900'>
													Date placed
												</dt>
												<dd className='sm:mt-1'>
													<time dateTime={order.createdAt}>
														{new Date(order.createdAt).toDateString()}
													</time>
												</dd>
											</div>
											<div className='flex justify-between pt-6 sm:block sm:pt-0'>
												<dt className='font-medium text-gray-900'>Order id</dt>
												<dd className='sm:mt-1'>{order.orderId}</dd>
											</div>
											<div className='flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0'>
												<dt>Total amount</dt>
												<dd className='sm:mt-1'>₹ {order.totalPrice}</dd>
											</div>
										</dl>
										<NextLink href={`/order/${order._id}`} passHref>
											<button className='w-full flex items-center justify-center bg-white mt-6 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:mt-0'>
												View Details
											</button>
										</NextLink>
									</div>

									<div className='px-4  sm:space-x-6 lg:space-x-8 mt-2'>
										<table className='w-full text-gray-500'>
											<thead className='text-sm text-gray-500 text-left'>
												<tr>
													<th
														scope='col'
														className='sm:w-2/5 lg:w-1/3 pr-8 py-3 font-normal'>
														Product
													</th>
													<th
														scope='col'
														className='hidden w-1/5 pr-8 py-3 font-normal sm:table-cell'>
														Price
													</th>
													<th
														scope='col'
														className='hidden pr-8 py-3 font-normal sm:table-cell'>
														Quantity
													</th>
													<th
														scope='col'
														className='w-0 py-3 font-normal text-right'>
														Info
													</th>
												</tr>
											</thead>
											<tbody className='border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t'>
												{order.orderItems.map(product => (
													<tr key={product._id}>
														<td className='py-6 pr-8'>
															<div className='flex items-center space-x-3'>
																<Image
																	src={product.image}
																	alt=''
																	layout='fixed'
																	height={50}
																	width={50}
																	className='w-16 h-16 object-center object-cover rounded'
																/>
																<div>
																	<div className='font-medium text-gray-900'>
																		{product.name}
																	</div>
																	<div className='mt-1 sm:hidden'>
																		₹ {product.price}
																	</div>
																</div>
															</div>
														</td>
														<td className='hidden py-6 pr-8 sm:table-cell'>
															₹ {product.price}
														</td>
														<td className='hidden py-6 pr-8 sm:table-cell'>
															{product.quantity}
														</td>
														<td className='py-6 font-medium text-right whitespace-nowrap'>
															<NextLink
																href={`/product/${product.slug}`}
																passHref>
																<p className='text-indigo-600 cursor-pointer'>
																	View
																	<span className='hidden lg:inline'>
																		{' '}
																		Product
																	</span>
																</p>
															</NextLink>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							))}
						</div>
					</main>
				)}
			</div>
		</>
	)
}

export default OrderHistory

export async function getServerSideProps(context) {
	const userInfo = JSON.parse(context.req.cookies['userInfo'])

	await db.connect()
	const orders = await Order.find({ user: userInfo._id }).sort({
		createdAt: -1,
	})
	await db.disconnect()

	return {
		props: {
			orders: JSON.parse(JSON.stringify(orders)),
		},
	}
}
