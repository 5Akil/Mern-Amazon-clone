import { AppDataSource } from "./data-source"
import * as express from 'express'
import * as cors from "cors"
import * as dotenv from 'dotenv';
import { routs } from "./router";
dotenv.config();
const app = express();




app.use(cors())
app.use(express.json())

const port = process.env.SERVER_PORT;

AppDataSource.initialize().then(async () => {

    app.use('/',routs)
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}).catch(error => console.log(error))
