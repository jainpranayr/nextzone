import nc from 'next-connect'
import { Product } from '../../../models'
import { db } from '../../../config'

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
