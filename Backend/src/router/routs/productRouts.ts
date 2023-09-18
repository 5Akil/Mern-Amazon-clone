import * as express from 'express'
import productsController from '../../controller/productController';

const productRoutes = express.Router();

productRoutes.get('/products', productsController.getAllProducts)

export default productRoutes


