import { Products } from "../entity/Products";
import { Request, Response } from 'express';

class productController {
    static getAllProducts = async (req:Request, res:Response) => {
        const response = await Products.find({});
        res.status(200).send(response)
    }
}

export default productController

