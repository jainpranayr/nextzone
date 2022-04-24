import nc from 'next-connect'
import { Order } from '/models'
import { isAuth, db, onError } from '/config'

const handler = nc({
  onError,
})
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  const orders = await Order.find({ user: req.user._id })
  res.send(orders)
})

export default handler
