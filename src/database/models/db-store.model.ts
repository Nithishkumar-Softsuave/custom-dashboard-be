import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  BeforeCreate,
  BeforeUpdate,
  AfterFind,
} from 'sequelize-typescript';
import { EncryptionHelper } from '../common/helper';

const fields = ['dbName', 'userName', 'password', 'host', 'port'];

@Table({
  tableName: 'db_store',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class DbStoreModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    field: 'cred_id',
  })
  credId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'db_name',
  })
  dbName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'user_name',
  })
  userName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'password',
  })
  password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'host',
  })
  host: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
    field: 'port',
  })
  port: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    field: 'org_id',
  })
  orgId: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_active',
  })
  isActive: boolean;

  @BeforeCreate
  @BeforeUpdate
  static async encryptSensitiveFields(instance: DbStoreModel) {
    for (const field of fields) {
      if (instance[field]) {
        instance[field] = await EncryptionHelper.encrypt(
          instance[field],
          field,
        );
      }
    }
  }

  @AfterFind
  static async decryptSensitiveFields(result: DbStoreModel | DbStoreModel[]) {
    const decryptFields = async (record: DbStoreModel) => {
      for (const field of fields) {
        if (record[field]) {
          record[field] = await EncryptionHelper.decrypt(record[field], field);
        }
      }
    };

    if (Array.isArray(result)) {
      for (const record of result) await decryptFields(record);
    } else if (result) {
      await decryptFields(result);
    }
  }
}
