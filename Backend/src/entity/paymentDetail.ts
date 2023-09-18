import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn, OneToOne } from 'typeorm';
import { Users } from './Users';
import { Order } from './Order';


// export type paymentFormat = "COD" | "EMI" | "DEBIT/CREDIT";

export type statusFormat = "pending" | "paid" | "shipped" | "delivered";

@Entity()
export class paymentDetails extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    paymentID: number;

    @OneToOne(() => Order, (item) => item.orderID)
    @JoinColumn({ name: 'orderID' })
    orderID: string;

    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'userID' })
    userID: Users;

    @Column({
        // type: 'enum',
        // enum: ["COD", "EMI", "DEBIT/CREDIT"],
        // default: "COD"
    })
    paymentMode: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'paid', 'shipped', 'delivered'],
        default: "pending"
    })
    status: statusFormat;

    @Column()
    paymentDate: Date;
}