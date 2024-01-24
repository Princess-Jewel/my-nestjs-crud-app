import { Model, Column, PrimaryKey, AutoIncrement, Table, HasMany } from 'sequelize-typescript';
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

  // Define the one-to-many relationship with UsersWallets
  @HasMany(() => UsersWallets)
  usersWallets: UsersWallets[];
}
