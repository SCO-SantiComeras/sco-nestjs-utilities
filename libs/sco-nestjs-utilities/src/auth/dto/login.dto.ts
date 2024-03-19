import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class LoginDto {
  
  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.NAME.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.NAME.INVALID_VALUE })
  @MinLength(4, { message: VALIDATION_ERROR_CONSTANTS.LOGIN.NAME.MIN_LENGTH })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.INVALID_VALUE })
  @MinLength(8, { message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.MIN_LENGTH })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: VALIDATION_ERROR_CONSTANTS.LOGIN.PASSWORD.MATCHES }
  )
  password: string;
}
