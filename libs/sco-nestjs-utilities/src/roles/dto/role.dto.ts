import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';
import { PermissionDto } from '@app/sco-nestjs-utilities/permissions/dto/permission.dto';

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
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.ROLE.PERMISSIONS.INVALID_VALUE })
  permissions?: PermissionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.ROLE.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
