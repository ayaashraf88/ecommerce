import Coupon from "../../../DB/Models/coupon.js"
import Product from "../../../DB/Models/product.js"
import Order from "../../../DB/Models/order.js"
import { DateTime } from "luxon"
import { qrCodeGeneration } from "../../utils/qr-codes.js"

export const createOrder = async (req, res, next) => {
    const { product, quantity, coupon, paymentMehtod, address, country, phone, city } = req.body
    const id = req.authUser
    const checkCoupon = await Coupon.findOne({code:coupon})
    const checkProduct = await Product.findById(product)
    if (!checkProduct) {
        return next({ message: "Product not found", status: 404 })
    }
    if (checkProduct.quantity < quantity) {
        return next({ message: "Quantity is not available", status: 404 })
    }
    let orderItem = [{
        product: product,
        quantity: quantity,
        price: checkProduct.price
    }]
    let shippingPrice = orderItem[0].price * quantity
    let total = shippingPrice
    // console.log("shippingPrice : "+shippingPrice)
    // console.log("checkCoupon.amount : "+checkCoupon.amount)
    if (checkCoupon) {
        if (checkCoupon.amount <= shippingPrice) {
            if (checkCoupon.isFixed) {
                total = shippingPrice - checkCoupon.amount
            } else {
                total = shippingPrice - (shippingPrice * checkCoupon.amount / 100)
            }
        } else {
            return next({ message: "Coupon can't be applied", status: 404 })

        }
    }
    let shippingAddress={
        address: address,
        country: country,
        phone: phone,
        city: city,
    }
    const newOrder = new Order({
        items: orderItem,
        shippingPrice: shippingPrice,
        finalPrice: total,
        paymentMehtod: paymentMehtod,
        shippingAddress,
        user: id,
        coupon: checkCoupon?._id
    })
    await newOrder.save()
    checkProduct.quantity-=quantity
    await checkProduct.save()
    const qr= await qrCodeGeneration(
        {
            orderId: newOrder._id,
            totalPrice: newOrder.finalPrice,
            shippingPrice: newOrder.shippingPrice,
            paymentMehtod: newOrder.paymentMehtod,
            shippingAddress: newOrder.shippingAddress,
            user: newOrder.user,
            coupon: newOrder.coupon,
            items: newOrder.items
        }
    )
    res.status(200).json({
        status: true,
        message: "Order Created Successfully",
        data: newOrder,
        qr
    })
}
export const convertCartToOrder=async (req,res,next)=>{
    const { product, quantity, coupon, paymentMehtod, address, country, phone, city } = req.body
    const id = req.authUser
    const checkCoupon = await Coupon.findOne({code:coupon})
    const checkProduct = await Product.findById(product)
    if (!checkProduct) {
        return next({ message: "Product not found", status: 404 })
    }
    if (checkProduct.quantity < quantity) {
        return next({ message: "Quantity is not available", status: 404 })
    }

    // console.log("shippingPrice : "+shippingPrice)
    // console.log("checkCoupon.amount : "+checkCoupon.amount)
    if (checkCoupon) {
        if (checkCoupon.amount <= shippingPrice) {
            if (checkCoupon.isFixed) {
                total = shippingPrice - checkCoupon.amount
            } else {
                total = shippingPrice - (shippingPrice * checkCoupon.amount / 100)
            }
        } else {
            return next({ message: "Coupon can't be applied", status: 404 })

        }
    }
    let orderItem = [{
        product: product,
        quantity: quantity,
        price: checkProduct.price
    }]
    let shippingPrice = orderItem[0].price * quantity
    let total = shippingPrice
    let shippingAddress={
        address: address,
        country: country,
        phone: phone,
        city: city,
    }
    const newOrder = new Order({
        items: orderItem,
        shippingPrice: shippingPrice,
        finalPrice: total,
        paymentMehtod: paymentMehtod,
        shippingAddress,
        user: id,
        coupon: checkCoupon?._id
    })
    await newOrder.save()
    checkProduct.quantity-=quantity
    await checkProduct.save()
    res.status(200).json({
        status: true,
        message: "Order Created Successfully",
        data: newOrder
    })
}
export const deliverOrder=async (req,res,next) => {
    const id=req.params.id
    const checkOrder=await Order.findById(id)
    // console.log(id)
    if(!checkOrder){
        return next({message:"Order not found",status:404})
    }
    if(checkOrder.status=='Paid'||checkOrder.isDelivered==true){
        return next({message:"Order is already delivered",status:404})
    }
    checkOrder.isDelivered=true
    checkOrder.status="Delivered"
    checkOrder.deliveredAt=DateTime.now().toISO()
    await checkOrder.save()
    res.status(200).json({
        status:true,
        message:"Order Delivered Successfully",
        data:checkOrder
    })
}