import { scheduleJob } from "node-schedule";
import Coupon from "../../DB/Models/coupon.js"
//import moment from "moment";
import {DateTime}from 'luxon'
export function checkCoupons(){
    scheduleJob('*/5 * * * * *',async ()=>{
        console.log('Checking Crons');
        const coupons=await Coupon.find({status:true})
        coupons.forEach(async coupon=>{
            // if(moment().isAfter(moment(coupon.toDate))){
            //     coupon.status=false
            //     await coupon.save()
            // }
              if(DateTime.fromISO(coupon.toDate)<DateTime.now()){
                coupon.status=false
                await coupon.save()
              } 
            
        })
    });
}
export function cron1(){
    scheduleJob('*/5 * * * * *',async ()=>{
        console.log('Checking Crons 1');
     
    });
}
export function cron2(){
    scheduleJob('*/5 * * * * *',async ()=>{
        console.log('Checking Crons 2');
     
    });
}
export function cron3(){
    scheduleJob('*/5 * * * * *',async ()=>{
        console.log('Checking Crons 3');
     
    });
}