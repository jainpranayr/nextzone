import nc from 'next-connect'
import bcrypt from 'bcryptjs'
import { User } from '../../../models'
import { db, signToken } from '../../../config'

const handler = nc()

// handleSignIn
handler.post(async (req, res) => {
  // connect to database
  await db.connect()

  // get user details from database
  const user = await User.findOne({ email: req.body.email })

  // disconnect database
  await db.disconnect()

  // check password
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // if password is coe=rrect store token
    const token = signToken(user)

    // send user details
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    // show error
    res.status(401).send({ message: 'Invalid user or password' })
  }
})

export default handler
