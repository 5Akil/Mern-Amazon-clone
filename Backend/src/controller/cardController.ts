import { Request, Response } from 'express';
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class cardController {

    static addCard = async (req: Request, res: Response) => {
        const { token, customerID, nameOnCard, isDefault } = req.body;
        console.log(token, "????????????????????//");

        console.log(req.body);
        

        try {
            const cards = await stripe.customers.listSources(
                customerID,
            );
            const existingCard = cards.data.find(
                (card) =>
                    card.object === "card" &&
                    card.last4 === token.card.last4 &&
                    card.exp_month === token.card.exp_month &&
                    card.exp_year === token.card.exp_year
            );
            if (existingCard) {
                // Card already exists, handle the error
                res.status(400).json({ error: 'Card already exists' });
            } else {
                // Add the new card to the customer's Stripe account
                const response = await stripe.customers.createSource(customerID, { source: token.id });
                if (isDefault) {
                    await stripe.customers.update(customerID, { default_source: response.id });
                }
                res.json({ success: true, message: 'Card added successfully' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static getCards = async (req: Request, res: Response) => {
        const { customerID } = req.params;
        try {
            const cards = await stripe.customers.listSources(
                customerID,
                // { object: 'card', limit: 3 }
            );
            res.status(200).send(cards.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default cardController



// const customer = await stripe.customers.update(
//     customerID,
//     {default_source: token.id }
//   );