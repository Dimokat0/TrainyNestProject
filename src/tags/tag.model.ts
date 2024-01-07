import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Post } from 'src/post/post.model';

@Table
export class Tag extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @BelongsToMany(() => Post, {
    through: 'PostTags',
    foreignKey: 'tagId',
    otherKey: 'postId',
  })
  posts: Post[];
}
