import { RoleDto } from './../../roles/dto/role.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.ID.INVALID_VALUE })
  _id?: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.INVALID_VALUE })
  @MinLength(4, { message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.MIN_LENGTH })
  @MaxLength(15, { message: VALIDATION_ERROR_CONSTANTS.USERS.NAME.MAX_LENGTH })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.INVALID_VALUE })
  @MinLength(8, { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.PASSWORD.MATCHES }
  )
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.INVALID_VALUE })
  @MinLength(8, { message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.NEW_PASSWORD.MATCHES }
  )
  newPassword?: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.INVALID_VALUE })
  @Matches(
    /.+@.+\..+/,
    { message: VALIDATION_ERROR_CONSTANTS.USERS.EMAIL.MATCHES }
  )
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: VALIDATION_ERROR_CONSTANTS.USERS.ACTIVE.INVALID_VALUE})
  active?: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.USERS.ROLE.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.USERS.ROLE.INVALID_VALUE})
  role: RoleDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.PWD_RECOVERY_TOKEN.INVALID_VALUE })
  pwdRecoveryToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: VALIDATION_ERROR_CONSTANTS.USERS.PWD_RECOVERY_DATE.INVALID_VALUE })
  pwdRecoveryDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.USERS.EXTENSION.INVALID_VALUE })
  extension?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.USERS.TYPE_OBJ.INVALID_VALUE })
  typeObj?: string;
}
