import { Router } from "express";
import * as BrandsController from  './brand.controller.js'
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerHost } from "../../middlewares/multer.middleware.js";
import { endpoints } from "./brands.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();
router.post('/create/:category_id/:sub_category_id',auth(endpoints.ADD_BRAND),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(BrandsController.addBrand))
// router.put('/update/:category_id',auth(endpoints.UPDATE_CATEGORY),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(categoryController.updateCategory))
// router.get('/all',expressAsyncHandler( categoryController.getAllCategories))

export default router;