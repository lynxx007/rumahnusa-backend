import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/config/security';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginPayload } from './payloads/loginPayload';
import { RegistrationPayload } from './payloads/registrationPayload';
import { HttpExceptionMessages } from 'src/common/const/exceptions/message';
import { JwtService } from '@nestjs/jwt';
import { mapUserToJwtPayload, mapUserToAuthResponse } from 'src/mapper/users';
import { AuthenticatedUserResponse } from 'src/common/const/types/auth';

@Injectable()
export class AuthenticationsService {
  private saltRounds = SALT_ROUNDS;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
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
      if (!isPasswordValid) throw new NotFoundException(HttpExceptionMessages.LOGIN_FAILED);
      
      // generate jwt token
      const jwtToken = this.jwtService.sign(mapUserToJwtPayload(user));

      return mapUserToAuthResponse(user, jwtToken); 
    } catch (err) {
      throw new NotFoundException(HttpExceptionMessages.LOGIN_FAILED);
    }
  }

  async validateRegistration(payload: RegistrationPayload): Promise<User> {
    try {
      const newUser = new User();
      newUser.email = payload.email;
      newUser.first_name = payload.first_name;
      newUser.last_name = payload.last_name;
      newUser.password = await this.hashPassword(payload.password);

      return this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async _findAuthenticatedUser(userEmail: string): Promise<User> {
    const user: User = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email: userEmail })
      .getOne();
    

    // TODO: isEmpty helper
    if (!user) throw new NotFoundException(HttpExceptionMessages.LOGIN_FAILED);

    return user;
  }
}
