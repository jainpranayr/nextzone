import nc from 'next-connect'
import bcrypt from 'bcryptjs'
import { User } from '../../../models'
import { db, signToken } from '../../../config'

const handler = nc()

// post user data to mongodb
handler.post(async (req, res) => {
  // connect to database
  await db.connect()

  // create new user
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  })
  const user = await newUser.save()

  // disconnect from database
  await db.disconnect()

  // generate jwt
  const token = signToken(user)

  // send back user data
  res.send({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  })
})

export default handler
