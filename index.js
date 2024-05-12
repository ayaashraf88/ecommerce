import  express from "express";
import db_connection from './DB/connection.js'
import userRouter from './src/modules/User/user.routers.js'
import authRouter from './src/modules/Auth/auth.routers.js'
import categoryRouter from './src/modules/Category/category.routers.js'
import subCategoryRouter from './src/modules/subCategory/subCategory.routers.js'
import brandsRouter from './src/modules/Brands/brands.routers.js'
import productsRouter from './src/modules/Products/products.router.js'
import cartRouter from './src/modules/Cart/cart.routers.js'
import couponRouter from './src/modules/Coupons/coupon.router.js'
import orderRouter from './src/modules/Orders/orders.routers.js'

import { globalResponse } from "./src/middlewares/globalRespose.middleware.js";
import { config } from 'dotenv'
import { rollbackMiddleware } from "./src/middlewares/rollback.middleware.js";
import { rollbackDocments } from "./src/middlewares/rollback-documents.middleware.js";
import { checkCoupons, cron1, cron2, cron3 } from "./src/utils/crons.js";
import { gracefulShutdown } from "node-schedule";
config({ path: './config/dev.config.env' })
db_connection()
const app=express()
app.use(express.json())
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/category',categoryRouter)
app.use('/subcategory',subCategoryRouter)
app.use('/brand',brandsRouter)
app.use('/product',productsRouter)
app.use('/cart',cartRouter)
app.use('/coupon',couponRouter)
app.use('/order',orderRouter)

checkCoupons()
cron1()
cron2()
cron3()
gracefulShutdown()
app.use(globalResponse,rollbackMiddleware,rollbackDocments)
app.listen(3000,()=>{
    console.log('listening to port 3000')
})