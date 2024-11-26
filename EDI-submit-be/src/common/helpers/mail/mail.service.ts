import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CommonMailDto } from './dto/mail.dto';
import { EmailFields, TemplateTypes } from './enums/template.code.enum';
import { IMail } from 'src/common/model/interface/IMail';
const path = require('path');

@Injectable()
export class MailService extends CommonMailDto {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async sendingMail(mailDto:IMail, templateTypes: TemplateTypes) {
    // try {
      const emailTemplatePath = path.join(__dirname, 'templates', templateTypes);
      await this.mailerService
        .sendMail({
          to: mailDto.to, // list of receivers
          from: EmailFields.reply_from, // sender address
          cc: mailDto.cc,
          subject: mailDto.subject, // Subject line
          template: emailTemplatePath,
          context: { 
            data: mailDto.data,
            otp:mailDto.otp,
          },
        })
      return {
        statusCode: HttpStatus.OK,
        message: 'Email sent successfully',
      };
    // } catch (error) {
    //   this.logger.error("🚀 ~ file: mails.service.ts ~ line 237 ~ MailsService ~ error", error)

    //   this.logger.verbose(
    //     `Some error occured during email`, error
    //   );

    //   if (error.status === 404) {
    //     throw new NotFoundException();
    //   }
    //   throw new InternalServerErrorException(error.message);
    // }
  }

}
