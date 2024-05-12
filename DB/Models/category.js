import mongoose, { model ,Schema} from "mongoose";
const categorySchema =new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    image:{
        secure_url:{type:String, required:true},
        public_id:{type:String, required:true,unique:true}
    },
    folder_id:{type:String, required:true,unique:true},
    addedBy:{type:Schema.Types.ObjectId,ref:'User',required:true},//superAdmin only
    updatedBy:{type:Schema.Types.ObjectId,ref:'User'},//superAdmin only 
},{timestamp:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}
})
categorySchema.virtual('SubCategories',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'parentCategory'
// justOne:true //btrg3 haga wa7da bs mn el relation
})
export default model('Category',categorySchema)