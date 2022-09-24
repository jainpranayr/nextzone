import NextLink from 'next/link'
import { Layout } from '../components'
import Categories from '../components/Categories'
import Hero from '../components/Hero'
import ProductsGrid from '../components/ProductsGrid'
import { db } from '../config'
import { Product } from '../models'

export default function Home({ products }) {
	return (
		<Layout sticky={true}>
			<div>
				<Hero />
				<Categories />
				{/* main products grid */}
				<section
					aria-labelledby='products-heading'
					className='xl:max-w-7xl xl:mx-auto xl:px-8'>
					<div className='flex px-4 sm:px-6 py-4 sm:items-center sm:justify-between lg:px-8 xl:px-0'>
						<h2
							id='favorites-heading'
							className='text-2xl font-extrabold tracking-tight text-gray-900'>
							New Arrivals
						</h2>
						<NextLink href={'/search?sort=newest'} passHref>
							<p className='hidden md:block text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer'>
								Browse all<span aria-hidden='true'> &rarr;</span>
							</p>
						</NextLink>
					</div>
					<ProductsGrid products={products?.slice(0, 8)} />
					<div className='-mt-6 sm:hidden'>
						<NextLink href={'/search?sort=newest'} passHref>
							<p className='text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer'>
								Browse all<span aria-hidden='true'> &rarr;</span>
							</p>
						</NextLink>
					</div>
				</section>
			</div>
		</Layout>
	)
}

// get products from database
export async function getServerSideProps() {
	// connect to database
	await db.connect()
	// get products and convert it to js object
	const products = await Product.find({}, '-reviews')
		.sort({ createdAt: -1 })
		.lean()
	// disconect from database
	await db.disconnect()

	return {
		props: {
			// pass products and convert _id, createdAt, updateAt to string
			products: products.map(db.convertDocToObj),
		},
	}
}
