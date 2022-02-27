import nc from 'next-connect'
import { Product } from '../../models'
import { db } from '../../config'
import { data } from '../../utils'

const handler = nc()

handler.get(async (req, res) => {
  // connect to database
  await db.connect()
  // empty database
  await Product.deleteMany()
  // insert  data
  await Product.insertMany(data.products)
  // disconnect from database
  await db.disconnect()
  res.send({ message: 'products seed to database successful' })
})

export default handler
