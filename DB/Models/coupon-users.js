import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    max_usage:{
        type:Number,
        required:true,
        min:1
    },
    usage_count:{
        type:Number,
        required:true,
        default:0
    }
}, {
    timestamps: true
})

export default mongoose.model("CouponUser", couponSchema);