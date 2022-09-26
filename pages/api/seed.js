import nc from 'next-connect'
import { db } from '../../config'
import { Product, User } from '../../models'
import { data } from '../../utils'

const handler = nc()

handler.get(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		// connect to database
		await db.connect()

		// empty database
		await User.deleteMany()
		await Product.deleteMany()

		// insert  data
		await User.insertMany(data.users)
		await Product.insertMany(data.products)

		// disconnect from database
		await db.disconnect()
		res.send({ message: 'products seed to database successful' })
	} else {
		res.send({ message: 'products can only be seeded in developmment' })
	}
})

export default handler
