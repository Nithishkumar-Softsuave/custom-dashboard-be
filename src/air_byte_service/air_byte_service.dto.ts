import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class DBCredentialsDto {
  @ApiProperty({ example: 'localhost' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ example: 5432 })
  @IsNumber()
  @IsOptional()
  port?: number;

  @ApiProperty({ example: 'postgres' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'root' })
  @IsString()
  @IsNotEmpty()
  passWord: string;

  @ApiProperty({ example: 'dashboard' })
  @IsString()
  @IsNotEmpty()
  dataBaseName: string;

  @ApiProperty({ example: 'postgres' })
  @IsString()
  @IsNotEmpty()
  dataBaseType: string;
}
