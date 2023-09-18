import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express';
import transporter from '../config/nodeMailer';
import { Users } from '../entity/Users';
import { Address } from '../entity/Address';

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
class userController {
    static registration = async (req: Request, res: Response) => {
        const { email, password, userName } = req.body
        try {
            // Check if the email already exists
            const exist = await Users.findOne({ where: { email: email } });
            if (exist) {
                return res.status(400).send({ message: 'Email already registered' });
            }
            const customer = await stripe.customers.create({
                email: email,
                name: userName, // You can customize this as needed
            });
            // console.log(customer, "<================");

            const hashPasswword = await bcrypt.hash(password, 10);
            // Create a new user
            const newUser = new Users()
            newUser.email = email;
            newUser.stripe_customer_id = customer.id
            newUser.password = hashPasswword;
            newUser.userName = userName;
            newUser.isVerified = false
            const created = await Users.save(newUser)
            const verificationLink = `http://localhost:5173/verify/${created.id}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: "Verify Email",
                html: `<a href=${verificationLink}>Click Here</a> to Verify your email.`
            };
            await transporter.sendMail(mailOptions);
            res.status(201).send({ message: 'User registered. Verification email sent.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
    static verifyUser = async (req: Request, res: Response) => {
        const userId = req.params.userId;
        try {
            const user = await Users.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            if (user.isVerified) {
                return res.status(400).send({ message: 'Email already verified' });
            }
            // Update the user's isVerified field
            user.isVerified = true;
            await Users.save(user);
            res.status(200).send({ message: 'Email verified successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        //check there is a data in database
        const exist = await Users.findOne({ where: { email: email } })
        if (exist === null) {
            return res.status(400).send({ message: 'User not found , Please first register' });
        }
        try {
            const isVerified = exist.isVerified
            if (isVerified) {
                const isMatched = await bcrypt.compare(password, exist.password)
                if (isMatched) {
                    // Generate JWT Token   
                    const access_token = jwt.sign({ userId: exist.id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "10m" })
                    // Generate JWT Refresh Token
                    const refresh_token = jwt.sign({ userId: exist.id }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: "1d" })
                    const responseBody = {
                        email: exist.email,
                        customerID: exist.stripe_customer_id,
                        userName: exist.userName,
                        accessToken: access_token,
                        refreshToken: refresh_token
                    }
                    res.status(200).send({ user: responseBody })
                } else {
                    res.status(400).send({ message: "wrong email or password" })
                }
            } else {
                res.status(400).send({ message: "please first verify your Email" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
    static getUser = async (req: Request, res: Response) => {
        const user = req.user;
        if (user) {
            res.status(200).send({ "status": "Authorized User", user })
        } else {
            res.status(401).send({ "status": "Unauthorized User" })
        }
    }
    static getNewToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.params
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            // Generate new JWT Token   
            const access_token = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: "10m" })
            return res.status(200).send({ messege: 'new access token generated', newAccessToken: access_token })
        } catch (error) {
            console.log(error);
            return res.status(403).send({ message: 'Token verification failed' });
        }
    }
    static addAddress = async (req: Request, res: Response) => {
        const { address, postalCode, city,
            state, country, defaultValue } = req.body
        const user = req.user
        const newAddress = new Address();
        newAddress.address = address;
        newAddress.userID = user.id;
        newAddress.state = state;
        newAddress.city = city;
        newAddress.country = country;
        newAddress.postalCode = postalCode;
        newAddress.isDefault = defaultValue;
        const response = await newAddress.save()

        if (response) {
            return res.status(200).send({ message: 'address added' })
        } else {
            return res.status(400).send({ message: 'bad request' })
        }
    }
    static getAllAddress = async (req: Request, res: Response) => {
        const address = await Address.find({})
        if (address) {
            res.status(200).send({ address })
        } else {
            res.status(400).send({ message: "there is no any address" })
        }
    }
    static getAddress = async (req: Request, res: Response) => {
        const { id } = req.params
        const address = await Address.findOne({ where: { id: id }, relations: { userID: true } })
        if (address) {
            res.status(200).send({ address })
        } else {
            res.status(400).send({ message: "there is no any address" })
        }
    }
    static editAddress = async (req: Request, res: Response) => {
        const { id } = req.params
        const { address, postalCode, city, state, country } = req.body
        const exist = await Address.findOne({ where: { id: id }, relations: { userID: true } })
        if (exist) {
            exist.address = address,
                exist.postalCode = postalCode,
                exist.state = state,
                exist.city = city,
                exist.country = country
            const response = await exist.save()

            if (response) {
                res.status(200).send(response)
            } else {
                res.status(400).send({ message: 'bad request' })
            }
        }
    }


}
export default userController

