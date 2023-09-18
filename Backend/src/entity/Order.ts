import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn } from 'typeorm';
import { Users } from './Users';
import { Promotion } from './Promotion';
import { Address } from './Address';

@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    orderID: string;

    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'userID' })
    userID: Users;
    
    @Column({ type: 'date'})
    orderDate: Date;
    
    @Column()
    totalAmount: number;
   
    @ManyToOne(()=>Address, (item)=>item.id)
    @JoinColumn({name: "addressID"})
    addressID:Address

}
