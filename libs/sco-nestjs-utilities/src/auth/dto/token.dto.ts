import { VALIDATION_ERROR_CONSTANTS } from './../../constants/validation-error-messages.constants';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class TokenDto {

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.ACCESS_TOKEN.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.ACCESS_TOKEN.INVALID_VALUE })
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.TOKEN_TYPE.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.TOKEN_TYPE.INVALID_VALUE })
  tokenType: string;

  
  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.USER.NOT_EMPTY })
  @IsObject({ message: VALIDATION_ERROR_CONSTANTS.TOKEN.USER.INVALID_VALUE })
  user: UserDto;

  constructor(accessToken: string, type: string, user: UserDto) {
    this.accessToken = accessToken;
    this.tokenType = type;
    this.user = user;
  }
}
