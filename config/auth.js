import jwt from 'jsonwebtoken'

// setup jwt signin token
const signToken = user => {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			isGuest: user.isGuest,
		},

		process.env.JWT_SECRET,
		{
			expiresIn: '30d',
		}
	)
}

// verfify if user is authorized
const isAuth = async (req, res, next) => {
	// get auth headers
	const { authorization } = req.headers
	if (authorization) {
		// get Bearer token
		const token = authorization.slice(7, authorization.length)
		// validate Bearer token
		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
				res.status(401).send({ message: 'Token is not valid' })
			} else {
				req.user = decode
				next()
			}
		})
	} else {
		res.status(401).send({ message: 'Token is not suppiled' })
	}
}

export { signToken, isAuth }
