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
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class RoleModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'role_id',
  })
  roleId: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'role_name',
  })
  roleName: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
  })
  isActive: boolean;
}
