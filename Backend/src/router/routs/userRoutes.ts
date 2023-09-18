import * as express from 'express'
import * as dotenv from 'dotenv';
import userAuth from '../../middelwares/userAuth';
import userController from '../../controller/userController';
dotenv.config()

const userRoutes = express.Router();
userRoutes.post('/registration', userController.registration)
userRoutes.get('/verify/:userId', userController.verifyUser)
userRoutes.post('/loginuser',userController.login)
userRoutes.get('/getnewaccesstoken/:refreshToken', userController.getNewToken)

userRoutes.post('/getuser', userAuth, userController.getUser)
userRoutes.post('/address', userAuth,  userController.addAddress)
userRoutes.get('/getAllAddress/', userAuth, userController.getAllAddress)
userRoutes.get('/getAddress/:id', userAuth, userController.getAddress)
userRoutes.post('/editAddress/:id', userAuth, userController.editAddress)



 
export default userRoutes
