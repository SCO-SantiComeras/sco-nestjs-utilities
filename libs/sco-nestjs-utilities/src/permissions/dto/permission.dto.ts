import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';
import { Type } from 'class-transformer';

export class PermissionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.NAME.INVALID_VALUE })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
