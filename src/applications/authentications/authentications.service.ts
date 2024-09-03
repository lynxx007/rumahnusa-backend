import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { SALT_ROUNDS } from 'src/const/app.const';
import { HTTP_CUSTOM_MESSAGES } from 'src/const/http.const';
import { DEFAULT_ROLE_NAME } from 'src/const/app.const';
import { VerificationCodeMailContext, WelcomeMailContext } from 'src/mail/interfaces';
import { WELCOME_EMAIL_SUBJECT, EMAIL_VERIFICATION_SUBJECT } from 'src/const/mail.const';

import { mapUserToJwtPayload, mapUserToAuthResponse } from 'src/utilities/mapper/user.mapper';
import { handleHttpError, isEmpty, generateOtp, getOtpExpirationTime } from 'src/utilities/helper';
import { AuthenticatedUserResponse } from 'src/types/auth.types';


import { LoginPayload } from './payloads/login.payload';
import { RegistrationPayload } from './payloads/register.payload';

import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';
import MailPayload from 'src/mail/entities';

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
      const jwtToken = this.jwtService.sign(mapUserToJwtPayload(user));

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

      this._sendWelcomeEmail(newUser, { name: newUser.first_name });
      this._sendVerificationEmail(newUser, { name: newUser.first_name, otp: newUser.verification_code });

      return this.userRepository.save(newUser);
    } catch (error) {
      handleHttpError(error);
    }
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
}
