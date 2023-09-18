import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Users } from './Users';

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user)=>user.id)
  @JoinColumn({name : 'userID'})
  userID: Users; 

  @Column()
  address: string;

  @Column( { nullable: true })
  city: string;

  @Column( { nullable: true })
  state: string;

  @Column()
  country: string;

  @Column()
  postalCode: number;

  @Column({default: false})
  isDefault: boolean;
}