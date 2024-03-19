import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EmailerRepository } from './emailer.repository';
import { MessageDto } from './dto/message.dto';
import { Response } from 'express';
import { HTTP_ERROR_CONSTANTS } from '../constants/http-error-messages.constants';

@Injectable()
export class EmailerService {

    constructor(private readonly emailerRepository: EmailerRepository) {}

    async sendMail(res: Response,email: MessageDto): Promise<Response<boolean, Record<string, boolean>>> {
        if (!email.receivers) {
            console.error(`[sendMail] ${HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_RECEIVERS_NOT_PROVIDED}`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_RECEIVERS_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
        }

        if (!email.text) {
            console.error(`[sendMail] ${HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_TEXT_NOT_PROVIDED}`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_TEXT_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
        }

        if (!email.subject) {
            console.error(`[sendMail] ${HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_SUBJECT_NOT_PROVIDED}`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_SUBJECT_NOT_PROVIDED, HttpStatus.PAYMENT_REQUIRED);
        }

        const emailSended: boolean = await this.emailerRepository.sendMail(email);
        if (!emailSended) {
            console.error(`[sendMail] ${HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_UNNABLE_TO_SEND}`);
            throw new HttpException(HTTP_ERROR_CONSTANTS.EMAILER.EMAIL_UNNABLE_TO_SEND, HttpStatus.CONFLICT);
        }

        console.log(`[sendMail] Email sent successfully`); 
        return res.status(200).json(emailSended);
    }
}
