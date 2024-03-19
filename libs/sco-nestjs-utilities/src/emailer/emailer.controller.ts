import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageDto } from './dto/message.dto';
import { Response } from 'express';
import { EmailerService } from './emailer.service';

@Controller('api/v1/emailer')
@ApiTags('emailer')
export class EmailerController {
  
  constructor(private readonly emailerService: EmailerService) {}

  @Post('sendMail')
  @ApiOperation({
    summary: 'sendMail',
    description: 'Send an email',
  })
  @ApiBody({
    description: 'Example to send a new email',
    type: MessageDto,
    examples: {
      a: {
        value: {
          subject: "Subject text title",
          receivers: ["youremail@gmail.com"],
          text: "This is a test email text",
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @ApiResponse({
    status: 402,
    description: 'Receivers not provided,  Text not provided,  Subject not provided',
  })
  @ApiResponse({
    status: 409,
    description: 'Unnable to send email',
  })
  async sendMail(
    @Res() res: Response,
    @Body(ValidationPipe) email: MessageDto
  ): Promise<Response<boolean, Record<string, boolean>>> {
    return await this.emailerService.sendMail(res, email);
  }
}
