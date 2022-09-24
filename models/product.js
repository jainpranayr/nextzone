import mongoose from 'mongoose'
import reviewSchema from './reviews'

// schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    reviews: [reviewSchema],
  },
  { timestamps: true }
)

// if model already present do not create new one
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)
export default Product
