import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity, JoinColumn, OneToMany } from 'typeorm';
import { Users } from './Users';
import { Products } from './Products';
import { OrderDetails } from './OrderDetails';

@Entity()
export class Cart extends BaseEntity{
  @PrimaryGeneratedColumn()
  cartItemID: number;

  @ManyToOne(() => Users, (user)=>user.id)
  @JoinColumn({name : 'userID'})
  userID: Users; 
  
  @ManyToOne(() => Products , (product)=>product.productID)
  @JoinColumn({name : 'productID'})
  productID: Products;

  @Column()
  quantity: number;

}
