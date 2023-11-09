import { Model, Column, PrimaryKey, AutoIncrement, Table, HasMany } from 'sequelize-typescript';
import { Comments } from './comments.model'; 


@Table
export class Posts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false }) 
  content: string;

  @Column
  userId: number;

  @Column
  images: string;

  @HasMany(() => Comments)
  comments: Comments[]; // This sets up a one-to-many relationship with Comments model

}




