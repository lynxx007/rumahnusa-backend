import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/config/security';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginPayload } from './payloads/loginPayload';
import { RegistrationPayload } from './payloads/registrationPayload';

@Injectable()
export class AuthenticationsService {
  private saltRounds = SALT_ROUNDS;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateLogin(payload: LoginPayload): Promise<User> {
    try {
      const user: User = await this.userRepository.findOneByOrFail({ email: payload.email });
      // TODO: JWT Implementation
      // TODO: Password Matching
      return user; 
    } catch (err) {
      throw new NotFoundException('Invalid Email or Password');
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
}
