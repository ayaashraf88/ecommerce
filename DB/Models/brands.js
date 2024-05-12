import mongoose, { model ,Schema} from "mongoose";
const brandSchema =new mongoose.Schema({

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
    parentCategory:{type:Schema.Types.ObjectId,ref:'Category',required:true},
    parentSubCategory:{type:Schema.Types.ObjectId,ref:'SubCategory',required:true},
    addedBy:{type:Schema.Types.ObjectId,ref:'User',required:true},//Admin only
    updatedBy:{type:Schema.Types.ObjectId,ref:'User'},//Admin only 
},{timestamp:true})
export default model('Brand',brandSchema)