import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn } from 'typeorm';
import { Promotion } from './Promotion';
import { Address } from './Address';
import { Products } from './Products';
import { Order } from './Order';

@Entity()
export class OrderDetails extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> Order , (item)=>item.orderID)
    @JoinColumn({name:'orderID'}) 
    orderID: string;

    @ManyToOne(() => Products, (product) => product.productID)
    @JoinColumn({ name: 'productID' })
    productID: Products;

    @Column()
    quantity: number;

}
