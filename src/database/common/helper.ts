import { Sequelize, QueryTypes } from 'sequelize';

export class EncryptionHelper {
  static encrypt: any;
  static decrypt: any;
  constructor(private sequelize: Sequelize) {}

  private get key(): string {
    if (!process.env.PSQL_ENCRYPTION_KEY) {
      throw new Error('PSQL_ENCRYPTION_KEY environment variable is not set.');
    }
    return process.env.PSQL_ENCRYPTION_KEY;
  }

  async encrypt(value: string, columnName = 'data'): Promise<string> {
    try {
      if (!value) return value;

      const [result]: any = await this.sequelize.query(
        `SELECT encode(encrypt(:text::bytea, :key::bytea, 'aes'), 'hex') as "encryptValue"`,
        {
          replacements: { text: value, key: this.key },
          type: QueryTypes.SELECT,
        },
      );

      return `\\x${result.encryptValue}`;
    } catch (error: any) {
      console.error(`Error while encrypting ${columnName}: ${error.message}`);
      return value;
    }
  }

  async decrypt(
    encryptedText: string,
    columnName = 'data',
  ): Promise<string | null> {
    try {
      if (!encryptedText) return null;

      const [result]: any = await this.sequelize.query(
        `SELECT convert_from(
            decrypt(decode(substr(:text, 3), 'hex'), :key::bytea, 'aes'),
            'SQL_ASCII'
          ) as "decryptedValue"`,
        {
          replacements: { text: encryptedText, key: this.key },
          type: QueryTypes.SELECT,
        },
      );

      return result.decryptedValue;
    } catch (error: any) {
      console.error(`Error while decrypting ${columnName}: ${error.message}`);
      return encryptedText;
    }
  }

  async decryptAndEncrypt(value: string, columnName = 'data'): Promise<string> {
    try {
      if (!value) return value;

      const decrypted = await this.decrypt(value, columnName);
      const reEncrypted = decrypted
        ? await this.encrypt(decrypted, columnName)
        : value;

      return reEncrypted;
    } catch (error: any) {
      console.error(
        `Error while decryptAndEncrypt ${columnName}: ${error.message}`,
      );
      return value;
    }
  }
}
