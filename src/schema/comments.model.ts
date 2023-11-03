import { Model, Column, PrimaryKey, AutoIncrement, Table } from 'sequelize-typescript';


@Table
export class Comments extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  postId: string;

  @Column({ allowNull: false }) 
  comment: string;

  @Column({ allowNull: false }) 
  userId: number;


}
