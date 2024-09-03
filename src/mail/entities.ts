import { ResetPasswordMailContext, VerificationCodeMailContext, WelcomeMailContext } from './interfaces';
import { User } from 'src/applications/users/user.entity';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { APP_NAME } from 'src/const/app.const';

class MailPayload implements ISendMailOptions{
  public to: string;
  public name: string;
  public subject: string;
  public template: string;
  public context: object;
  

  constructor(
    user: User,
    subject: string,
    template: string,
    data: WelcomeMailContext | VerificationCodeMailContext | ResetPasswordMailContext,
  ) {
    this.to = user.email;
    this.name = user.first_name;
    this.subject = subject;
    this.template = template;
    this.context = {
      ...data,
      appName: APP_NAME,
    };
  }
}

export default MailPayload;