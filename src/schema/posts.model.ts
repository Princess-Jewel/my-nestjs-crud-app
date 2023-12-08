// posts.model.ts
import { Model, Column, PrimaryKey, AutoIncrement, Table, HasMany } from 'sequelize-typescript';
import { Comments } from './comments.model'; 
import { Images } from './postImages.model';

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
  avatar: string;

  @HasMany(() => Comments)
  comments: Comments[];

  @HasMany(() => Images)
  images: Images[];

  @Column({ defaultValue: 0 })
  views: number;
}
