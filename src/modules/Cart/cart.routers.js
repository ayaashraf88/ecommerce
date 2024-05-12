import { Router } from "express";
import * as cartController from  './cart.controller.js'
import expressAsyncHandler from "express-async-handler";

import { endpoints } from "./cart.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();
router.post('/addToCart',auth(endpoints.ADD_TO_CART),expressAsyncHandler(cartController.addToCart))
router.post('/removeFromCart',auth(endpoints.ADD_TO_CART),expressAsyncHandler(cartController.removeFromCart))

export default router;