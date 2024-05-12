import mongoose, { model } from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.js";
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        enum: [systemRoles.User, systemRoles.Admin,systemRoles.SUPER_ADMIN],
        default:systemRoles.User
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    age:Number,
    phoneNumbers:[{
        type:String,
        required:true
    }],
    address:[{
        type:String,
        required:true
    }],

},{timestamps:true})
export default model('User',UserSchema)