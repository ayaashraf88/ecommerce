import { Router } from "express";
import * as subCategoryController from  './subCategory.controller.js'
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerHost } from "../../middlewares/multer.middleware.js";
import { endpoints } from "./subCategory.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();
router.post('/create',auth(endpoints.ADD_CATEGORY),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(subCategoryController.addCategory))
// router.put('/update/:category_id',auth(endpoints.UPDATE_CATEGORY),multerHost({extensions:allowedExtensions.image}).single('image'),expressAsyncHandler(subCategoryController.updateCategory))
// router.get('/all',expressAsyncHandler( subCategoryController.getAllCategories))

export default router;