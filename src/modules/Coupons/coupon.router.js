import { Router } from "express";
import * as couponController from  './coupon.controller.js'
import expressAsyncHandler from "express-async-handler";
import { endpoints } from "./coupon.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as validators from './coupon.validation.js'
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
const router=Router();
router.get('/validate/:code',expressAsyncHandler( couponController.validateCoupon))


router.post('/create',auth(endpoints.ADD_COUPON),
validationMiddleware(validators.addCouponSchema),
expressAsyncHandler(couponController.addCoupon))

export default router;