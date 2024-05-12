import { Router } from "express";
import * as ordersController from  './orders.controller.js'
import expressAsyncHandler from "express-async-handler";
import { endpoints } from "./orders.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router=Router();


router.post('/create',auth(endpoints.ADD_ORDER),
expressAsyncHandler(ordersController.createOrder))

router.put('/deliver/:id',auth(endpoints.ADD_ORDER),
expressAsyncHandler(ordersController.deliverOrder))

export default router;