import mongoose from 'mongoose'

// schema
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isAdmin: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
)

// if model already present do not create new one
const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
