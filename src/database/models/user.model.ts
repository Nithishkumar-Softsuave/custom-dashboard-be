import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  Unique,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'user_id',
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'username',
  })
  username: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'password',
  })
  password: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataType.UUID,
    field: 'role_id',
  })
  roleId: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
  })
  isActive: boolean;
}
