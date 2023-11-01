import { Model, Column, PrimaryKey, AutoIncrement, Table } from 'sequelize-typescript';


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


}
