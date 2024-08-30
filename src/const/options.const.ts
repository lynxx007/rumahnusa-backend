import { IsStrongPasswordOptions } from 'class-validator';

export const PASSWORD_VALIDATION_OPTIONS: IsStrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};


