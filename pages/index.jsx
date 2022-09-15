import { Layout, SingleProduct } from '../components'
import { Grid } from '@material-ui/core'
import { db } from '../config'
import { Product } from '../models'


export default function Home({ products }) {
	return (
		<Layout>
			<div>
				<h1 className='text-3xl my-2'>Products</h1>
				{/* main products grid */}
				<Grid container spacing={3}>
					{products.map(product => (
						// single product grid
						<Grid item md={4} key={product.name}>
							<SingleProduct product={product} />
						</Grid>
					))}
				</Grid>
			</div>
		</Layout>
	)
}

// get products from database
export async function getServerSideProps() {
	// connect to database
	await db.connect()
	// get products and convert it to js object
	const products = await Product.find({}, '-reviews').lean()
	// disconect from database
	await db.disconnect()

	return {
		props: {
			// pass products and convert _id, createdAt, updateAt to string
			products: products.map(db.convertDocToObj),
		},
	}
}
