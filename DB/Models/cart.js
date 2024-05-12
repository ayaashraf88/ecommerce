import mongoose, { Schema } from 'mongoose'
const cartSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 0 },
        price: { type: Number, required: true, default: 0 },
        finalPrice: { type: Number, required: true, default: 0 },
    }],
    totalPrice: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })
export default mongoose.model('Cart', cartSchema)