import mongoose, { Schema } from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category_id: {
        type: Schema.Types.ObjectId, ref: 'Category', required: true
    },
    subCategory_id: {
        type: Schema.Types.ObjectId, ref: 'SubCategory', required: true
    },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },//superAdmin only
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },//superAdmin only 
    brand_id: { type: Schema.Types.ObjectId, ref: 'Brand' },//superAdmin only
    desc: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    folder_id:{type: String, required: true, unique:true},
    quantity: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
    },
    appliedPrice: {
        type: Number,
        default: 0,
        required: true
    },
    rate: {
        type: Number,
        min: 0,
        max: 5
    },
    images:[{
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true }
    }],
    specifications:{
        type:Map,
        of:[String | Number]
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);