import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Post } from 'src/post/post.model';

@Table
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Post)
  posts: Post[];
}
