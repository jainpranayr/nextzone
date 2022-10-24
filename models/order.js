import mongoose from 'mongoose'

// schema
const orderSchema = new mongoose.Schema(
	{
		//   user details
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		username: { type: String, required: true },
		user_email: { type: String, required: true },

		// order details
		orderId: { type: String, required: true },
		orderItems: [
			{
				name: { type: String, required: true },
				quantity: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				slug: { type: String, required: true },
				description: { type: String, required: true },
			},
		],
		shippingAddress: {
			fullName: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			postalCode: { type: String, required: true },
		},
		subtotal: { type: Number, required: true },
		tax: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
		isPaid: { type: Boolean, required: true, default: false },
		isDelivered: { type: Boolean, required: true, default: false },
		paidAt: { type: Date },
		deliveredAt: { type: Date },
	},
	{
		timestamps: true,
	}
)

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export default Order
