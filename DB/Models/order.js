import mongoose, { Schema }  from "mongoose";

const schema=new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
         required:true
    },
    items:[{
        product:{
            type:Schema.Types.ObjectId,
            ref:'Product',
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true,
            min:1
        },
      
    }],
    shippingAddress:{
    address:{type:String,required:true},
    city:{type:String,required:true},
    country:{type:String,required:true},
    phone:{type:String,required:true}
    },
    finalPrice:{
        type:Number,
        required:true,
        min:1
    },
    shippingPrice:{
        type:Number,
        required:true,
        min:1
    },
    coupon:{
        type:Schema.Types.ObjectId,
        ref:'Coupon',
    },
    paymentMehtod:{
        type:String,
        Enum:['cash','paymob','stripe'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['pending','paid','delivered','canceled','placed'],
        default:'pending'
    },
    paidAt:{
        type:Date
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:{
        type:Date,
    },
    canceledAt:{
        type:Date,
    },
    canceledBy:{
        type:Schema.Types.ObjectId,
        ref:'User' 
    }


},{timestamps: true })
export default mongoose.model('Order',schema)