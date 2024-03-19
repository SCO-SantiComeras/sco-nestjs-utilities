import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';

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
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.PERMISSION.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
