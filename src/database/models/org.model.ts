import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'org',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OrgModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'org_id',
  })
  orgId: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'org_name',
  })
  orgName: string;

  @Unique
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    field: 'client_id',
  })
  clientId: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'admin_user_id',
  })
  adminUserId: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
  })
  isActive: boolean;
}
