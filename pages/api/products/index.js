import nc from 'next-connect'
import Product from '../../../models/product'
import db from '../../../config/db'

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
