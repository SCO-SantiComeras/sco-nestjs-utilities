import { VALIDATION_ERROR_CONSTANTS } from '../../constants/validation-error-messages.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SftpRequestDto {

  @ApiProperty()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.SFTP.PATH.INVALID_VALUE })
  path: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.SFTP.NEW_PATH.INVALID_VALUE })
  newPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: VALIDATION_ERROR_CONSTANTS.SFTP.RECURSIVE.INVALID_VALUE })
  recursive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: VALIDATION_ERROR_CONSTANTS.SFTP.VERBOSE.INVALID_VALUE })
  verbose?: boolean;

  constructor() {
    this.verbose = false;
  }
}