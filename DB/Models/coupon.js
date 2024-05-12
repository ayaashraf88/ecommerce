import mongoose ,{Schema} from "mongoose";
const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    amount:{
        type:Number,
        required:true, 
    },
    status:{
        type:Boolean,
        default:true
    },
    isFixed:{
        type:Boolean,
        default:false
    },
    isPercentage:{
        type:Boolean,
        default:false
    },
    fromDate:{
        type:String,
        required:true
    },
    toDate:{
        type:String,
        required:true
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

export default mongoose.model("Coupon",couponSchema);