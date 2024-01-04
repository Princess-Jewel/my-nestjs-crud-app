import { Model, Column, PrimaryKey, AutoIncrement, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Posts } from './posts.model';


@Table
export class ViewsHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false }) 
  userId: number;

  @Column ({allowNull: false})
  postId: number

  // @ForeignKey(() => Posts)
  // @Column
  // postId: number;

  // @BelongsTo(() => Posts)
  // post: Posts; // This sets up the association to the Posts model
}
