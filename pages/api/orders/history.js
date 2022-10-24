import nc from 'next-connect'
import { db, isAuth, onError } from '/config'
import { Order } from '/models'

const handler = nc({
	onError,
})
handler.use(isAuth)

handler.get(async (req, res) => {
	await db.connect()
	const orders = await Order.find({ user: req.user._id }).sort({
		createdAt: -1,
	})
	res.send(orders)
})

export default handler
