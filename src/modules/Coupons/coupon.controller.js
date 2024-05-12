import Coupon from "../../../DB/Models/coupon.js"
import {DateTime}from 'luxon'

export const addCoupon=async(req,res,next)=>{
    const{code,amount,isFixed,isPercentage,fromDate,toDate}=req.body
    const addedBy=req.authUser
    const check_code=await Coupon.findOne({code:code})
    if(check_code){
        return res.status(400).json({message:"Coupon code already exists"})
    }
    if(isFixed==isPercentage){
        return res.status(400).json({message:"isFixed and isPercentage cannot be same"})
    }
    if(isPercentage){
        if(amount>100) return res.status(400).json({message:"amount must be less than 100"})
    }
    const coupon=new Coupon({
        code:code,
        amount:amount,
        isFixed:isFixed,
        isPercentage:isPercentage,
        fromDate:fromDate,
        toDate:toDate,
        addedBy:addedBy
    })
    const result=await coupon.save()
    if(result){
        return res.status(200).json({message:"Coupon added successfully",data:result})
    }else{
        return res.status(400).json({message:"Something went wrong"})
    }


}
export const validateCoupon=async(req,res,next)=>{
    
const {code}=req.params
const coupon= await Coupon.findOne({code:code})
    if(!coupon){
        return res.status(400).json({message:"Coupon not found"})
    }
    
    if(DateTime.fromISO(coupon.fromDate)<DateTime.now()||DateTime.fromISO(coupon.toDate)<DateTime.now()||coupon.status==false){
        return res.status(400).json({message:"Coupon is expired"})
    }
    return res.status(200).json({message:"Coupon is available"})

}

