import nc from 'next-connect'
import { db, isAuth, onError } from '../../../../config'
import { Order } from '../../../../models'

const handler = nc({ onError })
handler.use(isAuth)

// put req to db
handler.put(async (req, res) => {
	// connect to db
	await db.connect()

	//   find order details
	const order = await Order.findById(req.query.id)

	//   if order exists
	if (order) {
		//   change isPaid to true
		order.isPaid = true

		// add timestamp
		order.paidAt = Date.now()

		// payment details
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			email_address: req.body.payer.email_address,
		}

		// save to db
		const paidOrder = await order.save()

		// disconnect db
		await db.disconnect()

		// send req
		res.send({ message: 'order paid', order: paidOrder })
	} else {
		// if order does'nt exist send 404 error
		await db.disconnect()
		res.status(404).send({ message: 'order not found' })
	}
})

export default handler
