import nc from 'next-connect'
import { db } from '/config'
import { Product } from '/models'

const handler = nc()

handler.get(async (Req, res) => {
	await db.connect()
	const categories = await Product.find().distinct('category')
	await db.disconnect()
	res.send(categories)
})

export default handler
