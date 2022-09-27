import nc from 'next-connect'
import { db } from '../../../config'
import { Product } from '../../../models'

const handler = nc()

handler.get(async (req, res) => {
	// connect to database
	await db.connect()
	// get products from database
	const products = await Product.find({})
	// disconnect from database
	await db.disconnect()
	res.send(products)
})

export default handler
