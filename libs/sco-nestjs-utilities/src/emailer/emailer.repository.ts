import { Inject, Injectable } from '@nestjs/common';
import { EmailerConfig } from './config/emailer-config';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class EmailerRepository {

  private _nodemailer: any;
  private _transport: any;

  constructor(@Inject('CONFIG_OPTIONS') private options: EmailerConfig) {
    this._nodemailer = require('nodemailer');
    this._transport = this._nodemailer.createTransport({
      service: this.options.service ? this.options.service : 'gmail',
      auth: {
        user: this.options.sending_Email_Address,
        pass: this.options.sending_Email_Password,
      },
      tls: {
        rejectUnauthorized: false
      },
      secure: false,
    });
  }

  async sendMail(data: MessageDto): Promise<boolean> {
    let sendMailResult = false;

    const mailOptions = {
      from: this.options.sending_Email_Address,
      to: data.receivers,
      subject: data.subject,
      html: '<p>' + data.text + '</p>',
      attachments: data.attachments && data.attachments.length > 0 ? data.attachments : [],
    };

    await this._transport.sendMail(mailOptions)
      .then(() => {
        sendMailResult = true;
      })
      .catch((error) => {
        console.error(`[sendMail] Error: ${JSON.stringify(error)}`);
      });

    return sendMailResult;
  }
}
