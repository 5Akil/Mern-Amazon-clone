// import express ,{Request , Response} from 'express'
import * as express from 'express'
import productRoutes from './routs/productRouts'
import cartRoutes  from './routs/cartRouts'
import userRoutes  from './routs/userRoutes'
import checkoutRoutes from './routs/checkoutRouts';
import cardRouts from './routs/cardRouts';



export const routs = express.Router();

routs.use(userRoutes)
routs.use(productRoutes)
routs.use(cartRoutes)
routs.use(checkoutRoutes)
routs.use(cardRouts)