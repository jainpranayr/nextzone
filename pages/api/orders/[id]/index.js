import nc from 'next-connect'
import { db, isAuth } from '../../../../config'
import { Order } from '../../../../models'

const handler = nc()
handler.use(isAuth)

// get order detalils from db
handler.get(async (req, res) => {
	await db.connect()
	const order = await Order.findById(req.query.id)
	await db.disconnect()
	res.send(order)
})

export default handler
