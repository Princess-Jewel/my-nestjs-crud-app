import { Model, Column, PrimaryKey, AutoIncrement, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Posts } from './posts.model';


@Table
export class Images extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

//  type: 'JSON' is used to represent an array of strings.
  @Column({ allowNull: false, type: 'JSON' }) 
  imageUrl: string[];

  @Column({ allowNull: false }) 
  userId: number;

  @ForeignKey(() => Posts)
  @Column
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts; // This sets up the association to the Posts model
}
