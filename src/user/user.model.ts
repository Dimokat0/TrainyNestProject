import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { Post } from '../post/post.model';

@Table
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  g_id: string;

  @Column({
    type: DataType.STRING,
  })
  f_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  access_token: string;

  @Column({
    type: DataType.STRING,
  })
  refresh_token: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
  })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Post)
  posts: Post[];
}
