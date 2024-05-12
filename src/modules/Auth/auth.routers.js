import { Router } from "express";
import * as authController from  './auth.controller.js'
import expressAsyncHandler from "express-async-handler";
const router=Router();

router.post('/signUp',expressAsyncHandler( authController.signUp))
router.get('/verify',expressAsyncHandler( authController.verify))
router.post('/signIn', expressAsyncHandler(authController.signIn))
export default router;