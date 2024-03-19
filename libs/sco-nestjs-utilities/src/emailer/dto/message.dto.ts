import { VALIDATION_ERROR_CONSTANTS } from "../../constants/validation-error-messages.constants";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MessageDto {

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.TEXT.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.TEXT.INVALID_VALUE })
  text: string;

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.RECEIVERS.NOT_EMPTY })
  @IsArray({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.RECEIVERS.INVALID_VALUE })
  receivers: string[];

  @ApiProperty()
  @IsNotEmpty({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.SUBJECT.NOT_EMPTY })
  @IsString({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.SUBJECT.INVALID_VALUE })
  subject: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: VALIDATION_ERROR_CONSTANTS.EMAILER.ATTACHMENTS.INVALID_VALUE })
  attachments?: any[];

  constructor(text: string, receivers: string[], subject: string, attachments: any[] = []) {
    this.text = text;
    this.receivers = receivers;
    this.subject = subject;
    this.attachments = attachments;
  }
}
