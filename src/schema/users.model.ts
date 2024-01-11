import { Model, Column, PrimaryKey, AutoIncrement, Table, HasOne } from 'sequelize-typescript';
import { UsersWallets } from './usersWallets.model';


@Table
export class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  fname: string;

  @Column({ allowNull: false }) 
  lname: string;

  @Column({ allowNull: false })
  age: number;

  @Column({ allowNull: false }) 
  password: string;

  // @Column({ allowNull: false }) 
  // avatar: string;

  // @Column({ allowNull: false }) 
  // wallet: number;


  // I commented them out because they are not supposed to be part of the payload when making a request

  // @HasOne(() => UsersWallets)
  // usersWallets!: UsersWallets;

}
