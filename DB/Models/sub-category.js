import mongoose, { model, Schema } from "mongoose";
const subCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true }
    },
    folder_id: { type: String, required: true, unique: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true },//superAdmin only
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },//superAdmin only
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },//superAdmin only 
}, {
    timestamp: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
subCategorySchema.virtual('Brands', {
    ref: 'Brand',
    localField: '_id',
    foreignField: 'parentSubCategory'
    // justOne:true //btrg3 haga wa7da bs mn el relation
})
export default model('SubCategory', subCategorySchema)