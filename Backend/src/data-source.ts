import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users } from "./entity/Users"
import { Products } from "./entity/Products"
import {  Cart} from "./entity/cart";
import { OrderDetails } from "./entity/OrderDetails";
import { Address } from "./entity/Address";
import { Promotion } from "./entity/Promotion";
import { paymentDetails } from "./entity/paymentDetail";
import { Order } from "./entity/Order";
const mysql = require('mysql');

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    // port: 3306,
    username: "root",
    password: "",
    database: "Newdb",
    synchronize: true,
    // logging: true,
    entities: [Users ,Cart, Products ,Order , OrderDetails ,Address , Promotion , paymentDetails],
    migrations: [],
    subscribers: [],
})
