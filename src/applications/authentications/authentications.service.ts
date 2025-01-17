import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ADMIN_APP_URL, RESET_PASSWORD_TOKEN_SECRET, SALT_ROUNDS } from 'src/const/app.const';
import { HTTP_CUSTOM_MESSAGES } from 'src/const/http.const';
import { DEFAULT_ROLE_NAME } from 'src/const/app.const';
import { ResetPasswordMailContext, VerificationCodeMailContext, WelcomeMailContext } from 'src/mail/interfaces';
import { WELCOME_EMAIL_SUBJECT, EMAIL_VERIFICATION_SUBJECT, RESET_PASSWORD_SUBJECT } from 'src/const/mail.const';

import { mapUserToJwtPayload, mapUserToAuthResponse } from 'src/utilities/mapper/user.mapper';
import { handleHttpError, isEmpty, generateOtp, getOtpExpirationTime, dateHasPassed } from 'src/utilities/helper';
import { AuthenticatedUserResponse } from 'src/types/auth.types';
import { HttpCustomResponse } from 'src/types/http.types';


import { LoginPayload } from './payloads/login.payload';
import { RegistrationPayload } from './payloads/register.payload';

import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import MailPayload from 'src/mail/entities';
import { EmailVerificationPayload } from './payloads/verification.payload';
import { ResendEmailVerificationPayload } from './payloads/resend-verification.payload';
import { ResetPasswordPayload } from './payloads/reset-password.payload';
import { RequestPasswordResetPayload } from './payloads/request-password-reset.payload';

@Injectable()
export class AuthenticationsService {
  private saltRounds = SALT_ROUNDS;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private mailService: MailerService
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateLogin(payload: LoginPayload): Promise<AuthenticatedUserResponse> {
    try {
      const user: User = await this._findAuthenticatedUser(payload.email);
      const isPasswordValid: boolean = await this.validatePassword(payload.password, user.password);
      if (!isPasswordValid) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.LOGIN_FAILED);
      
      // generate jwt token
      const jwtToken = this._generateJwtToken(user);

      return mapUserToAuthResponse(user, jwtToken); 
    } catch (err) {
      throw new NotFoundException(HTTP_CUSTOM_MESSAGES.LOGIN_FAILED);
    }
  }

  async validateRegistration(payload: RegistrationPayload): Promise<User> {
    try {

      const role: Role = await this.roleRepository.findOneBy({ title: DEFAULT_ROLE_NAME });
      if (isEmpty(role)) throw new NotFoundException('Default role doesn\'t exist.');

      const newUser = new User();
      newUser.email = payload.email;
      newUser.first_name = payload.first_name;
      newUser.last_name = payload.last_name;
      newUser.phone_number = payload.phone_number;
      newUser.password = await this.hashPassword(payload.password);
      newUser.role = role;
      newUser.verification_code = generateOtp();
      newUser.verification_exp_date = getOtpExpirationTime();
      newUser.is_verified = false;

      this._sendWelcomeEmail(newUser, { name: newUser.first_name });
      this._sendVerificationEmail(newUser, { name: newUser.first_name, otp: newUser.verification_code });

      return this.userRepository.save(newUser);
      // TODO: Return JWT Token as well
    } catch (error) {
      handleHttpError(error);
    }
  }

  async verifyEmail(payload: EmailVerificationPayload): Promise<HttpCustomResponse> {
    try {
      const user: User = await this.userRepository.findOneBy({ email: payload.email });

      if (isEmpty(user)) throw new NotFoundException('Email not valid.');

      if (dateHasPassed(user.verification_exp_date)) throw new UnprocessableEntityException('Expired OTP code.');

      if (user.verification_code != payload.otp) throw new UnprocessableEntityException('Invalid OTP code.');

      await this.userRepository.update({ id: user.id }, { verification_code: null, verification_exp_date: null, is_verified: true });
      const token: string = await this.jwtService.sign(mapUserToJwtPayload(user));

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.CREATE_SUCCESS, 'Ok', mapUserToAuthResponse(user, token));
      
    } catch (error) {
      handleHttpError(error);
    }
  }

  async resendVerificationEmail(payload: ResendEmailVerificationPayload): Promise<HttpCustomResponse> {
    
    const user: User = await this.userRepository.findOneBy({ email: payload.email });

    if (isEmpty(user)) throw new NotFoundException('Email not valid.');

    const verificationData: Partial<User> = { 
      verification_code: generateOtp(), 
      verification_exp_date: getOtpExpirationTime(),
    };

    await this.userRepository.update({ email: user.email }, verificationData);
    this._sendVerificationEmail(user, { name: user.first_name, otp: verificationData.verification_code });

    return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.DEFAULT, 'Ok');
  }

  async _findAuthenticatedUser(userEmail: string): Promise<User> {
    const user: User = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email: userEmail })
      .getOne();
    
    if (isEmpty(user)) throw new NotFoundException(HTTP_CUSTOM_MESSAGES.LOGIN_FAILED);

    return user;
  }

  async _sendWelcomeEmail(user: User, data: WelcomeMailContext) {
    const mailTemplate: string = './welcome';
    const mailSubject: string = WELCOME_EMAIL_SUBJECT;
    const mailPayload: MailPayload = new MailPayload(user, mailSubject, mailTemplate, data );
    await this.mailService.sendMail(mailPayload);
  }

  async _sendVerificationEmail(user: User, data: VerificationCodeMailContext) {
    const mailTemplate: string = './verify-email';
    const mailSubject: string = EMAIL_VERIFICATION_SUBJECT;
    const mailPayload: MailPayload = new MailPayload(user, mailSubject, mailTemplate, data);
    await this.mailService.sendMail(mailPayload);
  }

  async _sendPasswordResetEmail(user: User, data: ResetPasswordMailContext) {
    const mailTemplate: string = './reset-password';
    const mailSubject: string = RESET_PASSWORD_SUBJECT;
    const mailPayload: MailPayload = new MailPayload(user, mailSubject, mailTemplate, data);
    await this.mailService.sendMail(mailPayload);
  }

  _generateJwtToken(user: User): string {
    return this.jwtService.sign(mapUserToJwtPayload(user)); 
  }

  _generateResetPasswordToken(payload: any, jwtConfig: JwtSignOptions): string {
    return this.jwtService.sign(payload, jwtConfig);
  }

  async requestPasswordReset(payload: RequestPasswordResetPayload): Promise<any> {
    try {
      const user: User = await this.userRepository.findOneBy({ email: payload.email });
      if (isEmpty(user)) throw new NotFoundException('The provided email was not found');

      // generate password reset token
      const tokenConfig: JwtSignOptions = {
        expiresIn: '60m',
        secret: RESET_PASSWORD_TOKEN_SECRET,
      };

      const passwordResetPayload = {
        id: user.id,
        email: user.email,
        type: 'Password Reset',
      };

      const passwordResetToken: string = this._generateResetPasswordToken(passwordResetPayload, tokenConfig);
      const passwordResetLink: string = `${ADMIN_APP_URL}/reset-password?token=${passwordResetToken}`;

      this._sendPasswordResetEmail(user, { name: user.first_name, link: passwordResetLink });

      return new HttpCustomResponse('Instructions to reset your password will be sent to your email in a minute', 'Ok');

    } catch (error) {
      handleHttpError(error);
    }
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<HttpCustomResponse> {
    try {
      const jwtPayload = this.jwtService.verify(payload.token, { secret: RESET_PASSWORD_TOKEN_SECRET });
      const user: User = await this.userRepository.findOneBy({ id: jwtPayload.id });
      
      if (isEmpty(user)) throw new UnauthorizedException('Invalid token');

      const isOldPassword: boolean = await this.validatePassword(payload.password, user.password);
      if (isOldPassword) throw new UnprocessableEntityException('New password cannot be the same as the old password');

      await this.userRepository.update({ id: user.id }, { password: await this.hashPassword(payload.password) });

      return new HttpCustomResponse(HTTP_CUSTOM_MESSAGES.DEFAULT);
    } catch (error) {
      handleHttpError(error);
    }
  }
}
