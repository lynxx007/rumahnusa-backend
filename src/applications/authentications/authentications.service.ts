import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/config/security';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginPayload } from './payloads/loginPayload';
import { NotFoundException } from '@nestjs/common';

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
      return user; 
    } catch (err) {
      throw new NotFoundException(err);
    }
  }
}
