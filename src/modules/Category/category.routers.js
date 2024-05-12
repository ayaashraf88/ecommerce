import { Router } from "express";
import * as categoryController from  './category.controller.js'
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerHost } from "../../middlewares/multer.middleware.js";
import { endpoints } from "./category.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();
router.post('/create',auth(endpoints.ADD_CATEGORY),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categoryController.addCategory))
router.put('/update/:category_id',auth(endpoints.UPDATE_CATEGORY),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categoryController.updateCategory))
router.get('/all',expressAsyncHandler( categoryController.getAllCategories))
router.delete('/delete/:category_id',auth(endpoints.UPDATE_CATEGORY),expressAsyncHandler( categoryController.deleteCategory))


export default router;