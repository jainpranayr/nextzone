import SingleProduct from './SingeProduct'

export default function ProductsGrid({ products }) {
	return (
		<div className='grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 pb-12'>
			{products.map(product => (
				<SingleProduct product={product} key={product._id} />
			))}
		</div>
	)
}
