import nc from 'next-connect'
import { db } from '/config'
import { Product } from '/models'

const handler = nc()

// get specific product by id
handler.get(async (req, res) => {
	// connect to database
	await db.connect()
	// find product
	const product = await Product.findById(req.query.id)
	//disconnect from database
	await db.disconnect()

	res.send(product)
})

export default handler
