import { Cart } from "../entity/cart"
import { Request, Response } from 'express';

class cartController {
    static add = async (req: Request, res: Response) => {
        const { id, quantity } = req.body
        const user = req.user
        const exist = await Cart.findOne({ where: { productID: id } })
        try {
            if (exist !== null) {
                exist.quantity += 1
                await Cart.save(exist)
            } else {
                const item = new Cart()
                item.userID = user.id
                item.productID = id;
                item.quantity = quantity
                await Cart.save(item)
            }
            res.status(200).send({ "message": "success" })
        } catch (error) {
            res.status(400).send({ "message": "failed" })
        }
    }
    static count = async (req: Request, res: Response) => {
        const items = await Cart.find()
        const count = items?.length
        res.status(200).send({ count })
    }
    static getCartItems = async (req: Request, res: Response) => {
        const items = await Cart.find({
            relations: ["productID"],
        })
        res.status(200).send(items)
    }
    static incQty = async (req: Request, res: Response) => {
        const { id } = req.body;
        const exist = await Cart.findOne({ where: { productID: id } })
        if (exist !== null) {
            exist.quantity += 1
            await Cart.save(exist)
            res.status(200).send({ "message": "success" })
        } else {
            res.status(400).send({ "message": "failed" })
        }
    }
    static dcrQty = async (req: Request, res: Response) => {
        const { id } = req.body;
        const exist = await Cart.findOne({ where: { productID: id } })
        if (exist !== null) {
            if (exist.quantity > 1) {
                exist.quantity -= 1
                await Cart.save(exist)
            } else if (exist.quantity === 1) {
                await Cart.remove(exist)
            }
            res.status(200).send({ "message": "success" })
        } else {
            res.status(400).send({ "message": "failed" })
        }
    }
    static delete = async (req: Request, res: Response) => {
        const { id } = req.body
        const exist = await Cart.findOne({ where: { productID: id } })

        if (exist) {
            Cart.remove(exist);
            res.status(200).send({ "message": "success" })
        } else {
            res.status(400).send({ "message": "failed" })
        }
    }
    static clearCart = async (req: Request, res: Response) => {
        const user = req.user
        const exist = await Cart.find({ where: { userID: user.id } })
        if (exist) {
            Cart.remove(exist);
            res.status(200).send({ "message": "success" })
        } else {
            res.status(400).send({ "message": "failed" })
        }
    }


}


export default cartController