import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('MAILER_TYPE'),
      auth: {
        user: this.configService.get<string>('MAILER_EMAIL'),
        pass: this.configService.get<string>('MAILER_PASSWORD'),
      },
    });
  }

  async sendVerifyToken(email: string, token: number) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this.configService.get<string>('MAILER_TYPE'),
        to: email,
        subject: '회원가입 이메일 인증 코드',
        text: `인증 코드: ${token}`,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
}
