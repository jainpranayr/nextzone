import { nanoid } from 'nanoid'
import nc from 'next-connect'
import { db, isAuth, onError } from '../../../config'
import { Order } from '../../../models'

// use error function if error occurs
const handler = nc({
	onError,
})
handler.use(isAuth)

// post request
handler.post(async (req, res) => {
	// connect to db
	await db.connect()

	// instantiate new Order
	const newOrder = new Order({
		...req.body,
		user: req.user._id,
		username: req.user.name,
		user_email: req.user.email,
		orderId: nanoid(8),
	})
	// save to db
	const order = await newOrder.save()
	res.status(201).send(order)
})

export default handler
