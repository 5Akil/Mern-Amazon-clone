import { Request, Response } from 'express';
import { Order } from '../entity/Order';
import { OrderDetails } from '../entity/OrderDetails';
import { paymentDetails } from '../entity/paymentDetail';
import { Promotion } from '../entity/Promotion';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class checkoutController {
  static placeOrder = async (req: Request, res: Response) => {
    const { orderTotal, selectedAddress, paymentSelected, data, card } = req.body
    const user = req.user

    console.log(req.body);
    const paymentMethod = await stripe.paymentMethods.retrieve(card.id);
    console.log(paymentMethod, "<+++++++++++++++++++++++++++");
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: 1000,
        currency: 'usd',
        customer: user.stripe_customer_id,
        payment_method: card.id,
      },
    );

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

    // try {
    //     //save order entry in database
    //     console.log(req.body);
    //     const newOrder = new Order();
    //     newOrder.totalAmount = orderTotal
    //     newOrder.userID = user.id
    //     newOrder.orderDate = new Date()
    //     newOrder.addressID = selectedAddress.id
    //     const saved = await Order.save(newOrder)

    //     // save order datails in database 
    //     const orders = data.map(async (item) => {
    //         const newOrderDetail = new OrderDetails()
    //         newOrderDetail.orderID = saved.orderID
    //         newOrderDetail.quantity = item.quantity
    //         newOrderDetail.productID = item.productID.productID

    //         return await OrderDetails.save(newOrderDetail)
    //     })

    //     //save payment detail in database
    //     const payment = new paymentDetails()
    //     payment.paymentMode = paymentSelected;
    //     payment.paymentDate = new Date()
    //     payment.orderID = saved.orderID
    //     payment.userID = user.id
    //     const paymentEntry = await paymentDetails.save(payment)
    //     res.status(200).send({ message: 'order placed', saved })

    // } catch (error) {
    //     console.log(error);
    //     console.log("error");
    //     res.status(400).send({ message: "something bad happened" })
    // }
  }
  // static makePayment = async (req: Request, res: Response) => {



  //     // console.log(stripe , "<<<<<<<<<");

  //     const { paymentMethod } = req.body
  //     // console.log(token);

  //     try {
  //         const charge = await stripe.paymentIntents.create(
  //             {
  //               amount: 1000,
  //               currency: 'usd',
  //             //   paymentMethod:paymentMethod.id,
  //               automatic_payment_methods: {
  //                 enabled: true,
  //               },
  //             },
  //             // {
  //             //   stripeAccount: paymentMethod.id,
  //             // }
  //           );

  //         console.log(charge , '<===============');


  //         // Payment successful
  //         res.status(200).json({ message: 'Payment successful' });
  //     } catch (error) {
  //         console.error(error, '<error=============');
  //         res.status(500).json({ error: { message: 'Payment failed' } });
  //     }

  // }
  static makePaymentIntent = async (req: Request, res: Response) => {
    const { paymentMethod } = req.body
    const user = req.user

    try {


      const paymentIntent = await stripe.paymentIntents.create({
        amount: 94 * 100,
        currency: 'inr',
        // customer: customer.id,
        payment_method: paymentMethod.id,
        payment_method_types: ['card'],
        // shipping: {
        //   name: 'Jenny Rosen',
        //   address: {
        //     line1: '510 Townsend St',
        //     postal_code: '98140',
        //     city: 'San Francisco',
        //     state: 'CA',
        //     country: 'US',
        //   },
        // },
        description: 'Payment for Order #123', // Update as needed
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating Payment Intent:', error);
      res.status(500).json({ error: 'Unable to create Payment Intent' });
    }

  }
  static verifyPromotionalCode = async (req: Request, res: Response) => {
    const { code } = req.body
    const exist = await Promotion.findOne({ where: { code: code } })
    if (exist) {
      res.status(200).send(exist)
    } else {
      res.status(400).send({ message: 'bad request' })
    }
  }
}

export default checkoutController