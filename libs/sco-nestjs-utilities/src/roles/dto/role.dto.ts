import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';
import { PermissionDto } from '@app/sco-nestjs-utilities/permissions/dto/permission.dto';
import { Type } from 'class-transformer';

export class RoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.ROLE.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.ROLE.NAME.INVALID_VALUE })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: VALIDATION_ERROR_CONSTANTS.ROLE.PERMISSIONS.INVALID_VALUE })
  permissions?: PermissionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.ROLE.CREATED_AT.INVALID_VALUE })
  createdAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.ROLE.UPDATED_AT.INVALID_VALUE })
  updatedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.ROLE.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
