
import * as jwt from 'jsonwebtoken'
import { Users } from '../entity/Users';

const userAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            const token = authorization.split(' ')[1];
            const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            const exist = await Users.findOne({ where: { id: userId } });
            if (exist !== null) {
                req.user = exist;
                return next();
            }
            else { return res.status(404).send({ message: 'User not found' }); }
        } catch (error) {
            return res.status(401).send({ message: 'Invalid Token' });
        }
    } else {
        return res.status(401).send({ message: 'Missing Token' });
    }
};
export default userAuth;






