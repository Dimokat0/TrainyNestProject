import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table
export class Role extends Model {
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

  @HasMany(() => User)
  users: User[];
}
