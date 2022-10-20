import { nanoid } from 'nanoid'
import nc from 'next-connect'
import { db, isAuth, onError } from '../../../config'
import { Order, Product } from '../../../models'

// use error function if error occurs
const handler = nc({
	onError,
})
handler.use(isAuth)

// post request
handler.post(async (req, res) => {
	// connect to db
	await db.connect()

	req.body.orderItems?.forEach(async item => {
		const product = await Product.findById(item._id)
		if (product) {
			product.countInStock = product.countInStock - item.quantity
			await product.save()
		}
	})

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
