import * as express from 'express'
import userAuth from '../../middelwares/userAuth';
import cardController from '../../controller/cardController';

const cardRouts = express.Router();

cardRouts.post('/addCard' , userAuth , cardController.addCard)
cardRouts.get('/getCards/:customerID' , userAuth , cardController.getCards)

export default cardRouts