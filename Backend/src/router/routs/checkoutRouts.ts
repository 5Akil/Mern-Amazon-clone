import * as express from 'express'
import userAuth from '../../middelwares/userAuth';
import checkoutController from '../../controller/checkoutController';

const checkoutRoutes = express.Router();


checkoutRoutes.post('/placeOrder', userAuth, checkoutController.placeOrder)
checkoutRoutes.post('/create-payment-intent' , userAuth , checkoutController.makePaymentIntent)
// orderRoutes.post('/makePayment' , userAuth , checkoutController.makePayment)
checkoutRoutes.post('/verifyPromotionalCode', userAuth, checkoutController.verifyPromotionalCode)




export default checkoutRoutes