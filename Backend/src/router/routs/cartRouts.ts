import * as express from 'express'
import userAuth from '../../middelwares/userAuth';
import cartController from '../../controller/cartController'

const cartRoutes = express.Router();

cartRoutes.post('/add',userAuth,cartController.add )
cartRoutes.get('/count', cartController.count) 
cartRoutes.get('/cartitems',userAuth, cartController.getCartItems)
cartRoutes.post('/incrementquentity',userAuth, cartController.incQty)
cartRoutes.post('/decrementquentity',userAuth, cartController.dcrQty)
cartRoutes.delete('/remove',userAuth, cartController.delete)

export default cartRoutes


