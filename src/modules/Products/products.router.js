import { Router } from "express";
import * as productController from  './product.controller.js'
import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerHost } from "../../middlewares/multer.middleware.js";
import { endpoints } from "./product.endpoints.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router=Router();
router.post('/create',auth(endpoints.ADD_PRODUCT),multerHost({extensions:allowedExtensions.image}).array('files',3),expressAsyncHandler(productController.addProduct))
router.put('/update/:id',auth(endpoints.ADD_PRODUCT),multerHost({extensions:allowedExtensions.image}).single('file'),expressAsyncHandler(productController.updateProduct))
router.get('/all',expressAsyncHandler(productController.allProducts))
export default router;