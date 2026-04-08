import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { DBType } from './interface';

export class DbCredentialsDto {
  @ApiProperty({
    example: 'localhost',
    description: 'Database host name or IP address',
  })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({
    example: 5432,
    description: 'Database port number',
  })
  @IsNumber()
  @IsNotEmpty()
  port: number;

  @ApiProperty({
    example: 'admin',
    description: 'Database username',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    example: 'password123',
    description: 'Database user password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'my_database',
    description: 'Database name',
  })
  @IsString()
  @IsNotEmpty()
  database: string;

  @ApiProperty({
    example: DBType.POSTGRES,
    enum: DBType,
    description: 'Type of database being connected',
  })
  @IsEnum(DBType)
  @IsNotEmpty()
  dbType: DBType;
}
